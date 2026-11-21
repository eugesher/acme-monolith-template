# 023 — Processor app

`apps/processor-app` runs the background work of the template: the queue processors, one of them
scheduled. staff-app and customer-app enqueue, and staff-app serves the staff the failed jobs (see
`041-failed-jobs.md`). All three apps share one database and one Redis.

| Processor       | Entered by                                          | What it does                                                                      |
| --------------- | --------------------------------------------------- | --------------------------------------------------------------------------------- |
| `ledger`        | a job of the `ledger-record` queue                  | appends the record (see `008-queue-processor.md`)                                 |
| `idempotency`   | a job of the `idempotency-purge` queue, every 5 min | deletes the expired and stuck idempotency keys (see `009-scheduled-processor.md`) |
| `product-stock` | a job of the `product-stock-post-subtract` queue    | a transaction over two core modules (see below)                                   |

## Why a third app

**Background work scales and fails apart from HTTP.** A processor inside an HTTP app shares the
event loop of the requests, and a job that runs the process out of memory takes the API down with
it. processor-app is a process type of its own, so the HTTP apps scale with traffic and
processor-app with the queue. A schedule needs no app of its own: a job scheduler of BullMQ keeps it
in Redis and adds one job per tick however many replicas run (see `009-scheduled-processor.md`).

**No HTTP app owns this work.** The queues are written by several apps, and a processor of one HTTP
app would serve the others through a shared Redis anyway; a third app says so.

**People reach the API apps, not processor-app.** The failed jobs are routes for the staff, so they
live in staff-app, which already signs the staff in and checks their permissions (see
`041-failed-jobs.md`). processor-app answers only the probes of the orchestrator: it has no guards,
no `JWT_SECRET` and no staff entities.

## Shape

The app has the folders of an HTTP app and uses fewer of them:

| Folder                | What it holds                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| `src/main.ts`         | the same bootstrap as the other apps; it listens for the health probes                            |
| `src/app/setup`       | config                                                                                            |
| `src/common/shared`   | the registration of the `idempotency-purge` queue; `ledger-record` comes from `@acme-core/queues` |
| `src/contracts`       | `IDEMPOTENCY_PURGE_QUEUE`, the queue only processor-app writes and reads                          |
| `src/features/health` | `GET /health` and `GET /health/ready` for the orchestrator                                        |
| `src/processors`      | the three processors                                                                              |

**HTTP serves the probes.** The health routes are the only ones, and no guard runs, so they carry no
`@Public()`. `APP_PIPE`, `APP_FILTER`, `HttpSecurityModule` and `ThrottlerSetupModule` are those of
the other apps, so every app has the same HTTP edge (see `037-http-edge.md`).

**The config holds what the processors read**: the database, Redis, `IDEMPOTENCY_KEY_TTL_HOURS`,
`IDEMPOTENCY_IN_FLIGHT_TTL_MINUTES`, `ENQUEUE_RETRY_ATTEMPTS` of the core modules it mounts, the
logger and tracing, and the HTTP edge. No cache TTL and no `JWT_SECRET`.

**The entity list holds `IdempotencyKey`, `LedgerEntry`, `Product` and `ProductStock`**, the tables
of the purge, the ledger append and the stock check, with `Order`, `OrderProduct` and `Customer`,
which the relations of `ProductStock` need on the connection.

## The product-stock processor

`apps/processor-app/src/processors/product-stock` processes a queue that a core module fills after
its commits (see `022-enqueue-after-commit.md`). `ProductStockPostSubtractProcessor` opens the
correlation context of the job and runs one use case in one transaction:

1. `PRODUCT_STOCK_ON_HAND_PORT.lock` locks the rows and sums through
   `core/modules/src/product-stock`;
2. the processor's own repository reads what it needs of the same rows under that lock;
3. `PRODUCT_STOCK_ARCHIVE_PORT` writes through `core/modules/src/product` (see
   `027-core-module-outcomes.md`), which announces its write after the commit.

**The lock makes the check exact.** A write that commits before the lock is counted, a write that
comes after it waits (see `021-pessimistic-locking.md`).

**A replay writes nothing**, because the rows the first run changed are no longer picked.

**A failed check is logged as a failed ledger record is.** Every failed attempt reaches
`@OnWorkerEvent('failed')`, and `ProductStockPostSubtractReportFailureUseCase` logs it with the
product ids through the same `JobFailureHelper.report` (see `008-queue-processor.md`): at `warn`
while attempts are left, at `error` after the last one. A sold-out product the check did not archive
then shows in the logs, not only among the failed jobs (see `041-failed-jobs.md`).

## Running

| Script                         | What it does                                    |
| ------------------------------ | ----------------------------------------------- |
| `yarn start:dev:processor-app` | watch mode, reads `env/apps/processor-app/.env` |
| `yarn build:processor-app`     | the bundle in `dist/apps/processor-app`         |
| `yarn test:e2e:processor`      | the e2e suite (see `014-e2e-suites.md`)         |

`yarn start:dev` starts the three apps. The root `docker-compose.yml` runs processor-app on port
3002 from the same `Dockerfile`, with `APP_NAME=processor-app` (see `036-production-stack.md`).

**Every app points `REDIS_HOST` and `REDIS_PORT` at one Redis.** The producers and the processor
meet only in the queue: a producer with another Redis enqueues into a queue nobody reads.
