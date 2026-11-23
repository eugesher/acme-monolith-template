# 009 — Scheduled processor

`apps/processor-app/src/processors/idempotency-purge` deletes expired and stuck rows of
`idempotency_key` on a schedule. The keys are written by the core idempotency module (see
`006-idempotency-keys.md`), but nothing else deletes them, so the delete lives here with a
repository of its own (see `024-code-placement.md`). It is a processor: a job of the
`idempotency-purge` queue enters it, and a job scheduler of BullMQ adds that job every five minutes.

| Layer                        | What it holds                                                                                                                                                                            |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shell`                      | `IdempotencyPurgeModule`; `IdempotencyPurgeProcessor`: `onApplicationBootstrap` registers the schedule, `process` runs a purge                                                           |
| `application`                | `IdempotencyPurgeScheduleUseCase`, `IdempotencyPurgeUseCase`                                                                                                                             |
| `domain`                     | `IdempotencyPurgeHelper.expiryCutoff`, `IdempotencyPurgeHelper.inFlightCutoff`                                                                                                           |
| `outbound`                   | `IDEMPOTENCY_PURGE_SCHEDULE_PORT`, `IDEMPOTENCY_PURGE_REPOSITORY_PORT`, `IDEMPOTENCY_PURGE_IDEMPOTENCY_KEY_TTL_HOURS_TOKEN`, `IDEMPOTENCY_PURGE_IDEMPOTENCY_IN_FLIGHT_TTL_MINUTES_TOKEN` |
| `queues`                     | `IdempotencyPurgeQueue`: `NAME` and `register()`; `IIdempotencyPurgeQueuePayload`                                                                                                        |
| `infrastructure/queue`       | `IdempotencyPurgeScheduleQueueAdapter`                                                                                                                                                   |
| `infrastructure/persistence` | `IdempotencyPurgeRepository`                                                                                                                                                             |
| `infrastructure/config`      | `IdempotencyPurgeConfigIdempotencyKeyTtlHoursProvider`, `IdempotencyPurgeConfigIdempotencyInFlightTtlMinutesProvider`                                                                    |

The processor owns both TTLs: its `infrastructure/config` binds `IDEMPOTENCY_KEY_TTL_HOURS` and
`IDEMPOTENCY_IN_FLIGHT_TTL_MINUTES` to their tokens (see `030-config-values.md`). The core module
reads no configuration, so staff-app and customer-app need no TTL. On every tick the use case
computes two cutoffs, each the instant its TTL before now, and the repository deletes:

| Rows                       | Cutoff                                                 | Why                                             |
| -------------------------- | ------------------------------------------------------ | ----------------------------------------------- |
| every key, whatever status | `IDEMPOTENCY_KEY_TTL_HOURS`, 24 in the examples        | a client no longer retries a request that old   |
| the keys still `in_flight` | `IDEMPOTENCY_IN_FLIGHT_TTL_MINUTES`, 5 in the examples | the holder died before it could release the key |

**A stuck key frees itself within minutes.** A caller releases its key when its work throws (see
`006-idempotency-keys.md`), but a process that dies between `claim` and its transaction releases
nothing, and every retry with that key would get `in-flight` until the 24-hour purge. The short TTL
must outlast the longest write that holds a key, lock waits included: a key deleted under a live
holder lets a retry claim it and do the work twice. The five-minute tick bounds the wait for a
client to the in-flight TTL plus one tick.

## One purge per tick

**The schedule lives in Redis, not in a process.** On start every replica of processor-app calls
`upsertJobScheduler` with the id `idempotency-purge` and the pattern `*/5 * * * *`. BullMQ keeps one
scheduler per id, so the second replica updates the scheduler the first one made instead of adding
another, and the scheduler keeps one delayed job for the next tick. A worker of any replica takes
that job, so each tick runs one purge however many replicas there are, and no replica has to be the
one that schedules. A replica that restarts upserts the same scheduler again.

**A slow purge may meet the next one.** BullMQ adds the job of the next tick when the current one
starts, so a purge longer than five minutes can run beside the next tick on another replica. That is
harmless: a purge deletes by its cutoffs, so a concurrent one waits on the same row locks and then
finds the rows gone; a deadlock fails one purge, which logs its warning. One replica never runs two
purges at once: its worker processes one job at a time.

**The cadence is a constant of the use case.** `IdempotencyPurgeScheduleUseCase` passes its private
`PATTERN` to `IDEMPOTENCY_PURGE_SCHEDULE_PORT.register`, and `IdempotencyPurgeScheduleQueueAdapter`
upserts the scheduler under the name of the queue, with a job named the same. A changed pattern
replaces the stored one on the next start, since the id stays. A failed registration throws out of
`onApplicationBootstrap`, so processor-app does not start without its schedule.

## Entries and outcomes

**The processor opens a correlation context and nothing else.** Neither the start of the app nor a
job is a request, so no middleware has opened a context for them. `onApplicationBootstrap` and
`process` run their use case inside `CorrelationContextHelper.run` with no inbound id, which mints a
new id for the start and for every job. Everything they log carries it, and nothing logs the root
warning about a missing context.

**The use cases own the outcomes**, because a processor does not log: outcomes are logged by the
application.

- **A registration logs one line**, `Idempotency purge scheduled`, with the pattern.
- **A failed purge is logged, not thrown.** It logs
  `Idempotency purge failed, the next tick retries` at `warn` with the error, and the job completes.
  Expired keys only cost space until the next tick, so the queue keeps no failed purge and `/queues`
  does not list it (see `041-failed-jobs.md`).
- **A successful purge logs one line**, `Expired idempotency keys purged`, with each cutoff, the
  count of keys it deleted and its TTL. Each delete of the repository answers that count as a
  number, `affected` of the `DeleteResult` of TypeORM or 0, so the shape of the ORM stays in
  infrastructure.

## Wiring

The queue lives in `queues/` of the module, next to its layers: no other module writes or reads it.
`IdempotencyPurgeQueue` of `queues/definitions` holds its name, `NAME`, and its registration,
`register()`, which hands the name to `BullSetupModule.registerQueue`. The type of its job data,
`IIdempotencyPurgeQueuePayload` of `queues/types`, is `Record<string, never>`: the job carries no
data, and an add with any field does not compile. `IdempotencyPurgeModule` imports
`IdempotencyPurgeQueue.register()` and binds `IdempotencyPurgeScheduleQueueAdapter.PROVIDER` to
`IDEMPOTENCY_PURGE_SCHEDULE_PORT` (see `031-static-provider.md`); the processor takes
`IdempotencyPurgeQueue.NAME` for `@Processor`, and the adapter for `@InjectQueue` and the id of its
scheduler. Lint lets `shell/` and `infrastructure/queue` reach `queues/`, and no other layer (see
`016-lint-allowlists.md`). The e2e context reaches the queue by the literal `'idempotency-purge'`,
the name BullMQ sees. processor-app mounts `IdempotencyPurgeModule` through
`@acme-processor/processors`.

**The start of the app is an entry.** `IdempotencyPurgeProcessor` implements
`OnApplicationBootstrap`. No layer imports `@nestjs/schedule`.

The e2e suite adds a job to the queue itself and reads the rows, and it checks that the start left
exactly one scheduler with the pattern (see `014-e2e-suites.md`).
