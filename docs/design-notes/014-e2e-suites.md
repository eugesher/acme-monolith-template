# 014 — E2E suites

Each app has one e2e suite that boots its `AppModule` against the infrastructure of
`013-e2e-infrastructure.md`. The suites keep only what unit specs cannot show: SQL, transactions,
the wiring of guards, pipes, filters and middleware, the cache, idempotency and the ledger record
queue. Logic stays in the unit specs. staff-app and customer-app also have a system suite that boots
processor-app next to them (see System suites below).

## Running

```bash
yarn test:e2e
```

`test:e2e` rebuilds the infrastructure with `test:e2e:infra:reload` and runs `test:e2e:run`: the
five suites one after another, each after a reseed, as CI does, then one report with the tests,
failures, snapshots and seconds of each suite (`scripts/node/e2e-run.ts`). It runs every suite even
after a failure and exits with 1 if one failed.

```bash
yarn test:e2e:staff
```

`test:e2e:<suite>` is `test:e2e:infra:reseed` and then `test:e2e:<suite>:run`, the Jest run alone.
The suites are `staff`, `customer`, `processor`, `system:staff` and `system:customer`.

Each suite starts from a reseed: the cases write the fixtures, and a second run on the same data
fails. Every script passes `--ci`, so a run never writes a snapshot; a new or changed snapshot is
written by running Jest without it, then read before it is kept.

## Layout

```text
apps/<app>/test/
  jest-e2e.config.js
  app/app.e2e-spec.ts
  app/__snapshots__/app.e2e-spec.ts.snap
  context/app-e2e.context.ts
  features/index.ts
  features/<feature>/<feature>.e2e.ts
  features/<group>/<group>.e2e.ts
  features/<group>/modules/<feature>.e2e.ts
  processors/index.ts
  processors/<processor>/<processor>.e2e.ts
```

`processors/` exists in processor-app only: a processor class has one public method per entry of the
processor, named after it: `process()` for the jobs of its queue, and `onApplicationBootstrap()` for
what the idempotency processor does at the start of the app.

**`app.e2e-spec.ts` is the only Jest entry.** The app boots once, in `beforeAll`. The entry holds
one `describe` per feature and calls the methods of the feature class inside it:

```ts
describe('Note', () => {
  noteE2E.handleGetMany();
  noteE2E.handleEdit();
});
```

**A group of features has a class of its own** (see `025-feature-groups.md`). `AccessE2E.of(ctx)`
builds the classes of its modules from `modules/`, and `execute()` holds one `describe` per module
with the calls of that module. The entry calls only `execute()` inside the `describe` of the group,
and `features/index.ts` exports the group, not its modules:

```ts
describe('Access', () => {
  accessE2E.execute();
});
```

The name of a case starts with the group and the module: `Access › Role › GET /api/access/roles`.

The order of the calls is the order of the database states: the cases that read a whole list come
before the cases that write into it.

**A feature class has one public method per endpoint**, named after the controller method, and the
method wraps the `describe` of that endpoint. `ProductE2E.of(ctx)` builds it over the context. A
feature that needs a hook before each case has `hooks()`, as `CatalogE2E` of customer-app deletes
the `acme:catalog:*` keys from Redis.

**Every route handler has a case, and nothing else runs a controller.** A controller has no unit
spec (see `040-unit-specs.md`), so `spec/e2e-endpoints.spec.ts` asks the suites for it: each
decorated method of a controller has a method of the same name in the e2e class of its module, with
at least one case, and the file that builds that class with `<Class>.of(` calls it on
`<class>.<method>()`. The class mirrors the path of the module: `features/auth/shell` to
`test/features/auth/auth.e2e.ts`, `features/tools/modules/tag/shell` to
`test/features/tools/modules/tag.e2e.ts`, and a section every app runs alike to
`libs/testing/src/e2e/<name>.e2e.ts`. The cases cover what the command of a route reads: an optional
field of a request, a query or a path reaches the use case in at least one case, since the typecheck
does not miss a dropped optional field.

**A section every app runs alike lives in the testing lib.** The health endpoints, the headers of
helmet, CORS and the correlation id answer the same in the three apps, so `HealthE2E` of
`libs/testing/src/e2e/health.e2e.ts` holds their cases once and takes any `E2EContext`. Each entry
still mounts it in its `describe('Health')`: every app wires its edge itself, and the cases show
that each one did. processor-app has no `features/` left. The lint treats the file as e2e code
(`lint/configs/e2e.mjs` and `specs.mjs`), and the testing lib may import `supertest` for it.

**`AppE2EContext` mirrors `main.ts`.** Each context extends `E2EContext` of
`libs/testing/src/e2e/e2e.context.ts`, which holds what the contexts share: `init()` compiles the
`AppModule` it is given with `@nestjs/testing`, starts it with
`AppBootstrap.create(app, <app>).execute()` of `libs/app`, as `main.ts` does, and spies on the root
logger; `close()`, `takeRootWarnings()`, `mountedRoutes()` and `routeDtos()` round it off. The class
is not abstract: a context passes its `AppModule` and its `AppNameEnum` to the constructor, calls
`super.init()` and adds its own.

**A context of an app with auth signs tokens.** `AuthE2EContext` of
`libs/testing/src/e2e/auth-e2e.context.ts` extends `E2EContext` with the `AuthAudienceEnum` of the
app and, after `super.init()`, a `JwtService` with `JWT_SECRET` from the config and that audience.
The contexts of staff-app, customer-app and both system suites extend it and sign one access token
for each seeded account the cases use: admin, editor and viewer in staff-app, ann, bob and carol in
customer-app. processor-app has no auth and no `JWT_SECRET`, so its context extends `E2EContext` and
signs nothing. A subclass rather than an optional audience keeps both classes free of a branch.
Everything the cases read is a getter that throws before `init()`. The contexts of staff-app and
customer-app also hold the Redis client, through `@acme-libs/testing`.

**Each app suite pins the routes it mounts.** A case of its entry compares a literal table with what
the controllers of the started app declare. `mountedRoutes()` walks the controllers of the
`ModulesContainer` and answers `<METHOD> /<prefix>/<path>` per route, sorted by path; processor-app
compares that list alone. `routeAccess()` of `AuthE2EContext` pairs each route with what the guards
of `002-global-auth-guards.md` read, `getAllAndOverride` over the handler and its class: `public`,
the code of `@RequiresPermission`, or `authenticated` for a route that needs a token and no code.
`libs/auth` does not export its metadata keys, so the context names `auth:public` and
`auth:permission` itself. The table is the whole set: a route of the other app, a new route without
a row and a route that lost its decorator fail the case alike, the last because a route without a
code is open to every signed-in staff user. The notes are open on purpose: their use cases answer
only the notes of the caller, and their cases check that. No unit spec reads the metadata of a
route, and the specs of `libs/auth` check the guards on a route of their own, so the table is the
only check of the code each route asks for. Beyond it the suites keep one case per guard that shows
it is installed: 401 without a token, 403 to the viewer on `GET /api/access/permissions`, the
permissions read from the database rather than the claims of the token, and a revoked permission
refused at once.

**A suite checks that each route validates, not what.** `routeDtos()` of `E2EContext` answers per
route the classes of its `@Param()`, `@Query()` and `@Body()` arguments, in that order, read from
the design types the global `ValidationPipe` validates with, and a second case of the entry of
staff-app and customer-app compares them with a table. A parameter typed with an interface or a
`Pick` reads as `Object`, and the pipe lets it through unchecked: the typecheck passes, and only
this table fails. The rules of a DTO are checked by its spec (see `015-quality-gates.md`), so a
suite sends one invalid path parameter, query and body to show that the pipe is installed and how
its 400 reads, a request without the key on each route that requires `Idempotency-Key`, and one
malformed `If-Match`.

**A catalog case clears its own keys, not the database.** The queues live in the same Redis, under
`acme-e2e:queue:*` (see `032-queue-lib.md`), so `FLUSHDB` would drop their jobs and counters.
`hooks()` deletes the `acme:catalog:*` keys before each case, and the cases list those keys only:
BullMQ writes its own keys at any moment.

**staff-app and customer-app read the job, not the ledger.** Neither processes the queue, so their
contexts have `takeLedgerRecords()`: it returns the data of the waiting jobs of the `ledger-record`
queue and drains the queue, as `takeRootWarnings()` takes the warnings. A case that enqueues takes
the jobs, so the next case starts from an empty queue.

**staff-app fails a job by hand.** No processor runs in staff-app, so the `/queues` cases (see
`041-failed-jobs.md`) get a failed job from `failLedgerRecord(record)`: it adds the record with
`attempts: 1` and processes it by hand, as BullMQ documents it: a `Worker` without a processor, on
the connection and the prefix of the queue, takes the job with `getNextJob(token)` and fails it with
`moveToFailed(error, token)`. The context opens that worker in `init()` and closes it in `close()`:
a job the worker returns talks to Redis through the connection of the worker, so a case that reads
or removes the job after the failure needs the worker still open. These are the steps a processor
takes, so the job carries the instants and the stack trace the routes answer, and the failure under
the same token releases the lock that `getNextJob` set; a lock left behind would make the retry and
the delete of the job fail. The context throws if the next job is not the one it added. That a
returned record reaches the ledger is a seam of two apps, so it is a case of the system suite of
staff-app.

**processor-app waits for its queues.** Its cases add jobs to the queues themselves and read the
tables. `waitForLedgerRecordQueue()` polls `getJobCounts()` every 100 ms until no job is waiting,
active or delayed, and throws after 100 polls; the jobs run in the e2e process, so a drained queue
means the rows are written. A purge case adds a job to the `idempotency-purge` queue, as the job
scheduler does every five minutes, and `waitFor(description, settled)` polls the rows until the
outcome shows; the start case reads the schedulers of that queue (see `009-scheduled-processor.md`).
A failing job is a record whose `subjectType` is longer than its column, enqueued with
`attempts: 1`.

The Jest files outside the apps live in `jest/`:

| File                        | What it does                                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `jest-common.e2e.config.js` | the Jest config of a suite: its app, its root (`apps/<app>` unless given), aliases from `tsconfig.json`, `TZ=America/New_York` |

**The environment comes from `env/apps/<app>/.env.test`.** The scripts set `NODE_ENV=test`, and
`EnvHelper.appEnvFilePaths` picks that file, which is in the repository. `jest-common.e2e.config.js`
loads the file over the variables of the process, so a variable left in the shell, such as a
production database host, cannot point a suite at another database.

**The request limits of `.env.test` stay above what a suite sends.** Every case calls from the same
address, so `THROTTLE_LIMIT` and `THROTTLE_AUTH_LIMIT` there are far above the calls of a suite, and
a `:run` repeated within the window stays under them. The case that spends the auth limit sets
`HTTP_TRUST_PROXY_HOPS=1` to use: it logs in from an address of its own in `X-Forwarded-For`
(`203.0.113.0/24`, a documentation range), reads the limit from the config, and then checks that a
second address is still served. A repeated run finds that address blocked already, and the case
asserts only the last call, so it passes either way.

**An app under test listens on a port of its own.** The context starts the app as `main.ts` does,
`listen` included, so `PORT` of `.env.test` is 3100, 3101 and 3102 for customer-app, staff-app and
processor-app, next to the 3000, 3001 and 3002 of `.env.example`: a suite runs while the app runs
locally.

**`.env.test` allows one browser origin.** `HTTP_CORS_ORIGINS=https://app.example.test` lets the
health suite of each app check the preflight of an allowed origin and the missing header for any
other (see `037-http-edge.md`).

**The suites run west of UTC.** `TZ=America/New_York` shifts a value that drifts through the local
getters of a JavaScript `Date`, so a case catches it.

## Root warnings

The root `afterEach` fails a case when the root logger logged a warning during it:

```ts
afterEach(() => {
  expect(ctx.takeRootWarnings()).toEqual([]);
});
```

A warning on the root logger means a correlation context was lost: `CorrelationContextHelper` logs
one when it has to mint an id outside a request. `CorrelationIdHelper` logs one for an inbound id
that is not a UUID, so the health case that sends one takes the warning and checks it.

**A spy on `PinoLogger.root.warn` also sees the request loggers.** pino builds a child logger with
`Object.create(parent)`, so the request logger inherits the spied method of the root. The context
keeps a call only when the logger it was called on is the root itself, by `mock.contexts`.

## What a case checks

- **The status stays on the request**, `.expect(HttpStatus.X)`, and is not in the snapshot.
- **One object per case goes into `toMatchSnapshot()`**, its keys in the order they are read:
  `response: { body }`, then `db: { <table>: rows }`, then `cache: { keys, values }`.
- **The body is whole, and a row is read back whole**, with `SELECT *` and `ORDER BY`.
- **A value that changes per run gets a matcher in the snapshot and an exact check after it.** A row
  a case creates is found by `MAX(id)` read before the call: the snapshot has
  `id: expect.any(String)`, and a check after it compares the id with the response and with
  `MAX(id)`. A literal auto-increment id never enters a snapshot.
- **A case that needs a state the seeds lack makes it and undoes it in `finally`**, as the rollback
  of a note edit inserts the revision that breaks the edit and deletes it afterwards.
- **A case that writes sends a fixed `x-correlation-id`** when the correlation id lands in a row, so
  the row is literal in the snapshot. The id is a UUID, `e2e00000-0000-4000-8000-…` with a number
  per case, and the seeds use `5eed0000-0000-4000-8000-000000000001`: any other value is replaced.

## What the suites cover

The cases are the methods of the section classes: `apps/<app>/test/features/**/*.e2e.ts` and
`apps/processor-app/test/processors/**/*.e2e.ts`, mounted by `apps/<app>/test/app/app.e2e-spec.ts`.
The snapshots in `apps/<app>/test/app/__snapshots__` hold what each case asserts.

## System suites

`test/system/apps/<app>` starts an API app and processor-app in one process on the same MySQL and
Redis. It has the layout of `apps/<app>/test`: the entry `app/app-system.e2e-spec.ts`,
`context/app-e2e.context.ts` and the classes of `features/`. An app suite reads the waiting job and
stops there, a processor suite adds the job by hand, so neither proves that what a producer writes
is what the processor reads. A system suite covers that seam and nothing else: one case per producer
of a queue, and its snapshot holds the result of the job alone, the rows processor-app wrote and the
cache keys it dropped. What the API app answers and writes is already in the snapshot of its app
suite, so a system case sends the request with `.expect(status)` and keeps of the answer only the id
its exact checks compare with the ledger entry. A route that returns a failed job to the queue is a
producer too: the suite of staff-app lets processor-app fail a record, fixes it, retries it through
`/queues` and waits for its ledger entry.

**A job is awaited by its result.** `pollUntil(read, isDone)` waits first and reads after, 30
attempts 500 ms apart, and answers the last read, so a job that never lands fails on the snapshot. A
chain of jobs is awaited by its last row: the order case waits for the two ledger entries under one
correlation id, `OrderPlaced` and `ProductArchived` of the sold-out product.

**The apps share one environment.** Jest loads the `.env.test` of the API app, and processor-app
adds the variables only it has from its own file. The two differ in `PORT`, and no system case calls
processor-app over HTTP, so the context creates its Nest application and calls `init()` without
`listen`: its processors run and its schedule is registered, and it opens no port that would take
the `PORT` of the API app.

**Each app has its own data source, under one name.** A system suite prints the warning of
`DataSourceNameRegistry` of `@nestjs/typeorm`: "A data source with the default name is already
registered". The registry is one set for the process, and `TypeOrmModule.forRootAsync()` writes the
name into it when the decorator of `AppModule` runs, so the import of the second `AppModule` finds
`default` taken, before any app starts and so through the console logger of Nest, not pino. Nothing
is overridden: each app has its own container from `Test.createTestingModule`, its own `DataSource`
and its own pool, and TypeORM keeps no global registry of connections. A `name` per app would change
the token of `DataSource` everywhere it is injected by class, and the warning is left as it is.

**`test/system` is not plain node.** It compiles project code, so it has its own `tsconfig.json`
over the root one and the lint category `repo:system`: it sees its own files, the `AppModule` of
every app through its barrel `@acme-<app>/app`, the contracts of core, the libs `kernel`, `toolkit`,
`domain` and `testing`, and the packages `@nestjs/bullmq`, `@nestjs/common`, `bullmq`, `ioredis` and
`supertest`. BullMQ and the contracts of core let a case put a failing job into a queue, which no
route of an app writes. `test/infra` keeps running under plain node.

## Lint

`apps/*/test/**` is the category `acme-app:test`. It sees its own app's tests, its `AppModule`
through `@acme-<app>/app`, its contracts, the contracts of core, `@acme-core/entities`, the libs
`kernel`, `toolkit`, `domain`, `database`, `observability` and `testing`, and the packages
`@nestjs/bullmq`, `@nestjs/common`, `@nestjs/config`, `bullmq`, `ioredis`, `supertest` and
`typeorm`. `@nestjs/core`, `@nestjs/testing` and `nestjs-pino` stay in the testing lib. The
observability lib opens a correlation context for a case that calls a port directly, outside a
request, as `LedgerE2E` does for the core ledger. `spec/architecture/e2e-sections.spec.ts` checks
these edges.

The e2e code turns off `no-unsafe-argument`, `no-unsafe-assignment` and `no-unsafe-member-access`
(`lint/configs/e2e.mjs`): a response body and a query result are untyped by nature, and the snapshot
is what checks their shape. The same config adapts three test rules to the sections and the root
`afterEach` (see `015-quality-gates.md`).

## HTTP collection

`.http/` holds a [Posting](https://posting.sh) collection per app with one request per e2e case that
goes through HTTP, and names the `it` it repeats. See `.http/README.md`.
