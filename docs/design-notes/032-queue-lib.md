# 032 — Queue lib

All three apps connect BullMQ the same way, so the connection lives in a lib:
`libs/queue/src/bull/bull-setup.module.ts`.

| Method                          | Called by                               | What it returns                                                         |
| ------------------------------- | --------------------------------------- | ----------------------------------------------------------------------- |
| `BullSetupModule.forRoot()`     | `AppSetupBaseModule` of `libs/app`      | `BullModule.forRootAsync`: the connection to Redis, prefix, job options |
| `BullSetupModule.registerQueue` | `core/queues`, `queues/` of a processor | `BullModule.registerQueue({ name })`                                    |

```ts
export class LedgerQueue {
  public static readonly NAME = 'ledger-record';

  public static register(): DynamicModule {
    return BullSetupModule.registerQueue(LedgerQueue.NAME);
  }
}
```

**A queue is registered by the module root that binds its adapter.** A queue adapter of
`infrastructure/queue` carries its binding in a static `PROVIDER` (see `031-static-provider.md`),
and the module root imports the registration next to it: `LedgerCoreModule`,
`ProductStockCoreModule` and `QueueModule` of staff-app mount registrations of `@acme-core/queues`,
`IdempotencyPurgeModule` the one of its `queues/`. Registering the queue and binding the adapter sit
in one list, so they cannot drift apart.

**A queue is a class with its name and its registration.** `NAME` is what BullMQ sees and what
`@Processor`, `@InjectQueue` and `queue.add` take; `register()` hands it to
`BullSetupModule.registerQueue` for a module root to import. A queue that several modules use lives
in `core/queues/src/definitions`, one flat file per queue, `<module>.queue.ts`: `LedgerQueue` and
`ProductStockPostSubtractQueue` serve the core queue adapters, the failed jobs of staff-app (see
`041-failed-jobs.md`), the processors and the e2e code. A queue of one processor lives in
`queues/definitions` of the processor, as `IdempotencyPurgeQueue` of processor-app does (see
`009-scheduled-processor.md`). The type of a job stays a contract: the payload of a core queue in
`@acme-core/contracts`, since `ILedgerCoreEnqueueCommand` is built from it, the payload of a queue
of one processor in its `queues/types`.

**A setup class, not a module.** `BullSetupModule` has no `@Module`: it is a class of static methods
that return the modules of `@nestjs/bullmq`, and the options are built in the private static
`options(config)`. `LocalStorageSetupModule` of `libs/local-storage` follows the same shape (see
`012-app-bootstrap.md`).

**The lib has no port.** BullMQ is reached through its decorators: a producer injects the queue with
`@InjectQueue` in its `infrastructure/queue` adapter, and a processor declares `@Processor` on a
`WorkerHost` in its `shell` (see `008-queue-processor.md`). The lib holds only what every app needs:
the connection, the prefix, the job options and the registration of a queue.

## The connection is per app, the job options are not

`forRoot()` takes the address, the password and the TLS of Redis from `RedisConfigHelper.connection`
of `libs/config`; the cache and the request limits take `failFast`, which adds no offline queue and
a command timeout. BullMQ gets the options, not a client: it opens the connections itself and sets
`maxRetriesPerRequest: null` on the blocking connection of a worker, whose commands wait for jobs
longer than a command timeout. A queue keeps the defaults of ioredis, so an enqueue has a deadline
of its own (see `022-enqueue-after-commit.md`). The job options are the private constant
`DEFAULT_JOB_OPTIONS` of `BullSetupModule`, listed in `008-queue-processor.md`. Several apps write
to `ledger-record` and to `product-stock-post-subtract`; options read from the environment of each
app would let their jobs retry differently, while the code of the lib is the same in every app.

**The keys of every queue start with `QUEUE_PREFIX`.** It replaces the default `bull` of BullMQ:
`acme:queue` in `.env.example` puts the queues in the namespace of the template next to the keys of
the cache (`acme:catalog:*`, see `020-cross-app-cache-invalidation.md`), apart from any other user
of `bull` in the same Redis, such as Bull, whose keys have other structures. The e2e suites set
`acme-e2e:queue` in `.env.test`: a local run and the e2e share one Redis, and a worker of a local
`processor-app` would otherwise take the jobs of a suite. Unlike the job options, the prefix comes
from the environment, since it tells environments apart, not apps: every app of one environment sets
the same value, or a producer and its worker meet on different keys and the jobs wait unseen.

**`registerQueue` takes the name alone.** `@nestjs/bullmq` merges the root options and the queue
options shallowly, so a queue with `defaultJobOptions` of its own would replace the root ones as a
whole. With the name alone, every queue of every app enqueues with the options of `forRoot()`, and a
worker takes the connection and the prefix of its queue.

## Who sees the lib

| Importer                           | Uses            |
| ---------------------------------- | --------------- |
| `AppSetupBaseModule` of `libs/app` | `forRoot()`     |
| `core/queues`                      | `registerQueue` |
| `queues/` of a processor           | `registerQueue` |

No other layer imports `libs/queue`, and none of the importers above imports `@nestjs/bullmq`: the
package is left to the lib, to the queue adapters of `infrastructure/queue` and to the processors in
`shell/`. The lib itself sees `@nestjs/bullmq`, `@nestjs/common` and `@nestjs/config` (see
`016-lint-allowlists.md`).
