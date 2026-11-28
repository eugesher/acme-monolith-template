# Acme Monolith Template

Three NestJS apps on one MySQL and one Redis: `staff-app` (port 3000), `customer-app` (port 3001)
and `processor-app` (port 3002).

## Contents

1. [What you need](#what-you-need)
2. [Run locally](#run-locally)
3. [Migrations](#migrations)
4. [Tests](#tests)
5. [Run in production](#run-in-production)

## What you need

- Node 26.13 or later
- Docker with Compose

If you don't have the right Node version, install it with [nvm](https://github.com/nvm-sh/nvm):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.41.0/install.sh | bash && source ~/.nvm/nvm.sh # if you don't have nvm yet
nvm install # reads the version from .nvmrc
```

On a minimal Linux (a server, a Docker image) Node won't start without `libatomic1`. On Ubuntu and
Debian:

```bash
sudo apt-get install libatomic1
```

Turn on Yarn through Corepack:

```bash
npm install --global corepack # CI and the Dockerfile pin 0.36.0
corepack enable
```

Then install the dependencies:

```bash
yarn install
```

## Run locally

1. [Test infrastructure](#test-infrastructure)
2. [Env files](#env-files)
3. [Start](#start)
4. [Debug](#debug)

### Test infrastructure

Development and e2e get their own infrastructure in Docker: MySQL, Redis, Jaeger and an
OpenTelemetry collector. A local run and the e2e suites share it, so they share the database too.
Start it: the command prints the logs of the containers and returns once they're ready, with an
empty database; the containers keep running in the background:

```bash
yarn test:e2e:infra:up
```

To remove the containers along with their data:

```bash
yarn test:e2e:infra:down
```

### Env files

Every `.env.example` in `env/apps/` and `env/migrations/` already has everything you need to connect
to the test infrastructure. For a local run you make copies of them (they're gitignored), and the
`.env.test` files for e2e live right in the repo. There are no defaults: if a variable is missing or
broken, the process stops with a validation error.

| File                       | Who reads it                                 |
| -------------------------- | -------------------------------------------- |
| `env/apps/<app>/.env`      | the app, on `yarn start:dev`                 |
| `env/apps/<app>/.env.test` | the e2e and system suites of the app         |
| `env/migrations/.env`      | `yarn migration:*`                           |
| `env/migrations/.env.test` | the migrations and seed of an e2e data reset |

Make the copies:

```bash
cp env/apps/staff-app/.env.example env/apps/staff-app/.env
cp env/apps/customer-app/.env.example env/apps/customer-app/.env
cp env/apps/processor-app/.env.example env/apps/processor-app/.env
cp env/migrations/.env.example env/migrations/.env
```

### Start

With the test infrastructure running, create the schema:

```bash
yarn migration:run
```

Load the seed data once:

```bash
yarn test:e2e:infra:seed
```

And start all three apps in watch mode:

```bash
yarn start:dev
```

Traces are in the Jaeger of the test infrastructure: <http://localhost:16687>.

To start one app, there's `yarn start:dev:staff-app`, `yarn start:dev:customer-app` and
`yarn start:dev:processor-app`.

### Debug

Start all three apps under the inspector in watch mode:

```bash
yarn start:debug
```

For one app, use `yarn start:debug:staff-app`, `yarn start:debug:customer-app` or
`yarn start:debug:processor-app`. Each one has its own port: 9229 (`staff-app`), 9230
(`customer-app`) and 9231 (`processor-app`). Attach a Node debugger to that port on `127.0.0.1`, for
example `pwa-node` of `js-debug` with `request: "attach"`. The scripts set
`RSPACK_SOURCE_MAPS=true`, so the build writes `dist/apps/<app>/main.js.map` with the absolute paths
of the sources, and breakpoints in the `.ts` files bind. Every other build, `yarn start:dev` and the
image included, writes no maps.

## Migrations

The migrations live in `migrations/snapshots/`, and their SQL is written by hand: there's no
generation from the entities. The commands work with the database of `env/migrations/.env`:

| Command                        | What it does                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `yarn migration:create <Name>` | creates `migrations/snapshots/<timestamp>-<Name>.ts` with empty `up` and `down`; the name is PascalCase |
| `yarn migration:run`           | applies the migrations that haven't run yet                                                             |
| `yarn migration:revert`        | reverts the last applied one, through its `down`                                                        |
| `yarn migration:show`          | lists the migrations, the applied ones marked `[X]`                                                     |
| `yarn migration:cli <command>` | any other TypeORM CLI command with the same config                                                      |

For example:

```bash
yarn migration:create AddProductSku
```

## Tests

1. [Unit tests](#unit-tests)
2. [E2E tests](#e2e-tests)

### Unit tests

The unit tests don't need any infrastructure. Run them all:

```bash
yarn test:unit
```

With coverage, like CI: the threshold is 100% for every file of `apps`, `core` and `libs`, and the
report goes to `coverage/unit`:

```bash
yarn test:unit:coverage
```

To run one file or folder, add its path:

```bash
yarn test:unit libs/toolkit
```

The specs run one at a time: the architecture specs of `spec/` create and remove temporary fixtures,
and in parallel they get in each other's way.

### E2E tests

Recreate the test infrastructure and run every suite one after another, with one report at the end.
CI runs the same thing:

```bash
yarn test:e2e
```

If the infrastructure is already up, `yarn test:e2e:run` runs the same suites without recreating it.
To run one suite, use its script: it resets the data first, because the tests write to the fixtures:

```bash
yarn test:e2e:staff
```

The suites are `test:e2e:staff`, `test:e2e:customer`, `test:e2e:processor`, and the system suites
`test:e2e:system:staff` and `test:e2e:system:customer`, which start an API app together with
`processor-app`. Each has a `:run` variant, such as `test:e2e:staff:run`, that skips the reset.

A local run and the e2e suites share the database, so both `yarn test:e2e` and the reset before a
suite wipe whatever a local run wrote.

## Run in production

There are two ways. If everything lives on one machine, the root `docker-compose.yml` builds the
images, starts MySQL, Redis, Jaeger and an OpenTelemetry collector, applies the migrations and
starts the three apps. If you already have MySQL, Redis and a collector elsewhere (a cloud database,
for example), and an orchestrator (Kubernetes, ECS) runs the images or CI builds them and pushes
them to a registry, you don't need Compose: you build and run the images yourself. Both ways use the
same env files.

1. [Production env files](#production-env-files)
2. [With Compose](#with-compose)
3. [Without Compose](#without-compose)

### Production env files

The apps and the migrations read the `.env` files of `env/`, mounted read-only into their
containers. These are the same files a local run uses, so on a developer machine the production
values replace the local ones. Create them from the examples:

```bash
cp env/apps/staff-app/.env.example env/apps/staff-app/.env
cp env/apps/customer-app/.env.example env/apps/customer-app/.env
cp env/apps/processor-app/.env.example env/apps/processor-app/.env
cp env/migrations/.env.example env/migrations/.env
```

Change these values in the env files. "Apps" means the three `env/apps/<app>/.env` files,
"migrations" means `env/migrations/.env`:

| Variable                      | Value                                                 | Files                       |
| ----------------------------- | ----------------------------------------------------- | --------------------------- |
| `NODE_ENV`                    | `production`                                          | apps                        |
| `API_USE_API_REFERENCE`       | `false`                                               | apps                        |
| `DATABASE_HOST`               | `mysql`                                               | apps and migrations         |
| `DATABASE_PORT`               | `3306`                                                | apps and migrations         |
| `DATABASE_PASSWORD`           | the value of `MYSQL_PASSWORD`                         | apps and migrations         |
| `REDIS_HOST`                  | `redis`                                               | apps                        |
| `REDIS_PORT`                  | `6379`                                                | apps                        |
| `REDIS_PASSWORD`              | the value of `REDIS_SERVER_PASSWORD`                  | apps                        |
| `JWT_SECRET`                  | 32 characters or more, a different secret in each app | `staff-app`, `customer-app` |
| `OTEL_SDK_DISABLED`           | `false`                                               | apps                        |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | `http://otel-collector:4318`                          | apps                        |
| `OTEL_RESOURCE_ATTRIBUTES`    | `deployment.environment=production`                   | apps                        |

Without Compose, put the addresses of your MySQL, Redis and collector instead of `mysql`, `redis`
and `otel-collector`, with their ports and passwords. Without a collector, set
`OTEL_SDK_DISABLED=true`.

`DATABASE_SSL_CA` and `REDIS_TLS_CA` turn on an encrypted connection (TLS) to MySQL and Redis. They
hold the path to the certificate authority file the app uses to check that it's talking to the real
server; an empty value means a connection without TLS. You need them when the database or Redis is
hosted by a cloud provider that only accepts TLS: get the file from the provider, mount it into the
containers and put its path here. The migrations connect to the database too, so `DATABASE_SSL_CA`
goes into `env/migrations/.env` as well.

For example, with the files mounted at `/app/certs/`:

```dotenv
DATABASE_SSL_CA=/app/certs/mysql-ca.pem
REDIS_TLS_CA=/app/certs/redis-ca.pem
```

With Compose, mount the folder with the files into every app and into `migrations` in
`docker-compose.yml`, next to the env file:

```yaml
volumes:
  - type: bind
    source: ./certs
    target: /app/certs
    read_only: true
```

The `acme` user of the compose file has every privilege on `acme_db`. If you'd rather narrow the
apps down to `SELECT`, `INSERT`, `UPDATE` and `DELETE`, create a separate user for them, put it in
`DATABASE_USER` and `DATABASE_PASSWORD` of the three app files, and keep `acme` in
`env/migrations/.env`, since the migrations change the schema:

```sql
CREATE USER 'acme_app'@'%' IDENTIFIED BY '<password>';
GRANT SELECT, INSERT, UPDATE, DELETE ON acme_db.* TO 'acme_app'@'%';
```

`HTTP_TRUST_PROXY_HOPS` tells the app how many of your proxies (a load balancer, nginx and so on)
sit in front of it. With that number the app finds the real client IP in the `X-Forwarded-For`
header, and the request limits are counted per client IP. Set it lower than the actual number of
proxies, and the app takes a proxy for the client, so all users share one limit; set it higher, and
the app trusts an address the client could have faked, so the limit can be bypassed. For example:

| Value | Setup                               |
| ----- | ----------------------------------- |
| `0`   | the app faces the internet directly |
| `1`   | one load balancer or nginx in front |
| `2`   | Cloudflare → nginx → the app        |

For a browser client served from another origin, list that origin in `HTTP_CORS_ORIGINS`, for
example `https://app.example.com`, or several separated by commas. Left empty, the browser refuses
every request from another origin.

If you change `AUTH_ARGON2_*` in `env/apps/staff-app/.env`, set the same values in
`env/migrations/.env`: they hash the password of the first administrator.

### With Compose

Create the file with the passwords of the database and Redis, and fill in its three values:

```bash
cp env/compose/.env.example env/compose/.env
```

Build and start everything. Every `docker compose` command of this stack takes this file:

```bash
docker compose --env-file env/compose/.env up --build --detach
```

The apps start once the `migrations` container has exited with code 0. Each one answers on
`GET /api/health` at port 3000 (`staff-app`), 3001 (`customer-app`) or 3002 (`processor-app`). MySQL
and Redis are published only on `127.0.0.1`, like Jaeger, whose traces are at
<http://127.0.0.1:16686>.

Create the first administrator once, after the migrations. The command creates the user and the
`admin` role with the `access:manage` permission, and fails without changes if the email is taken.
Add `ADMIN_EMAIL` and `ADMIN_PASSWORD` (12 characters or more) to `env/migrations/.env` and run the
script in a one-off container of the `migrations` service, which already has the code, this env file
and access to the database; `--rm` removes the container once the script is done:

```bash
docker compose --env-file env/compose/.env run --rm migrations node ./scripts/node/admin-create.ts
```

Then remove both variables from the file. The administrator creates the other roles and users
through `/api/access` of `staff-app`.

### Without Compose

The `Dockerfile` builds two images: the app and the migrations. The app image has the compiled app
and its dependencies; `APP_NAME` picks which of the three apps to build:

```bash
docker build --build-arg APP_NAME=staff-app --tag acme-staff-app .
```

The migrations image has the `migrations/` folder and the `admin-create` script, with no app code;
by default it applies the migrations and exits. The migrations get an image of their own because
they run once before the apps start, not in every replica, and under a user with schema privileges
the apps don't need:

```bash
docker build --target migrations --tag acme-migrations .
```

First apply the migrations and wait for the container to exit with code 0:

```bash
docker run --rm --volume "$PWD/env/migrations/.env:/app/env/migrations/.env:ro" acme-migrations
```

Create the first administrator with the same image, with `ADMIN_EMAIL` and `ADMIN_PASSWORD` in
`env/migrations/.env`, as described above:

```bash
docker run --rm --volume "$PWD/env/migrations/.env:/app/env/migrations/.env:ro" acme-migrations node ./scripts/node/admin-create.ts
```

Then start the apps, each with its own env file and port:

```bash
docker run --rm --volume "$PWD/env/apps/staff-app/.env:/app/env/apps/staff-app/.env:ro" --publish 3000:3000 acme-staff-app
```

## Caching

The cache lives in Redis, and all three apps share one Redis. The scheme is simple (cache-aside):
look for the value in Redis, and if it isn't there, compute it and store it with a TTL. When a write
makes the value stale, it just gets deleted. Right now one thing is cached: the product catalog,
`GET /api/products` in `customer-app`. `staff-app` and `processor-app` drop it when they change
products.

1. [What it's made of](#what-its-made-of)
2. [App startup](#app-startup)
3. [A cached request](#a-cached-request)
4. [Dropping after a write](#dropping-after-a-write)
5. [When Redis is down](#when-redis-is-down)
6. [Traces](#traces)
7. [Settings](#settings)
8. [How to cache something of your own](#how-to-cache-something-of-your-own)
9. [How to check it](#how-to-check-it)

### What it's made of

- `libs/cache` is the library itself. It provides `CACHE_PORT` with three methods: `wrap` (take it
  from the cache, or compute and store it), `get` (just take it) and `delByPrefix` (delete every key
  with a prefix).
- `libs/contracts/src/cache` holds `CACHE_PORT` and the `CACHE_KEYS`. The keys live in a shared
  contract because one app stores them and another one deletes them.
- Module ports. Features don't touch `CACHE_PORT` directly: each one has its own port
  (`CATALOG_CACHE_PORT`, `PRODUCT_CATALOG_CACHE_PORT`, `PRODUCT_CORE_CATALOG_CACHE_PORT`), and an
  adapter in `infrastructure/cache` builds the key and calls `CACHE_PORT`.

Keys look like this: `acme:catalog:v1:page:<page>:limit:<limit>`. The shared prefix lets one
`delByPrefix('acme:catalog:v1:')` wipe every page of the catalog. The `v1` is there for when the
format of the value changes (say, a product gets a new field). Then you change `CATALOG_KEY_VERSION`
in `libs/contracts/src/cache/keys/cache-keys.ts` to `v2` by hand, and the new code reads and writes
only `acme:catalog:v2:...` keys. Nobody deletes the old `v1` entries: they're just never read again
and expire on their TTL. It also saves you during a rollout: while old replicas are still running,
they read their `v1` and new ones read their `v2`, so nobody gets a value in the wrong format.

### App startup

The cache is wired in `AppSetupBaseModule`, so all three apps have it. At startup an ioredis client
gets created: the address and password come from `REDIS_*`, TLS from `REDIS_TLS_CA` and the
per-command timeout from `REDIS_COMMAND_TIMEOUT_MS`. The client starts connecting right away, but
the app doesn't wait for it: if Redis isn't up yet, the app starts anyway, and the client logs a
warning and reconnects on its own.

If any `REDIS_*` is missing (and `CACHE_TTL_MS_DEFAULT` in `customer-app`), the app stops at startup
with a validation error.

The tracer has to load before ioredis, otherwise Redis commands don't show up in traces. That's why
the first line of `main.ts` is `import '@acme-libs/observability/tracer'`.

On shutdown the app closes its Redis connection.

### A cached request

What happens on `GET /api/products?page=1&limit=2` in `customer-app`:

1. `CatalogGetProductListCase` fixes up `page` and `limit` (at most 1000 and 100, 1 and 20 by
   default) and hands the cache port a `compute` function that reads the page from the database. The
   case knows nothing about keys or hits.
2. `CatalogCacheAdapter` builds the key `acme:catalog:v1:page:1:limit:2` and calls
   `CACHE_PORT.wrap`.
3. `wrap` looks the key up in Redis. If it's there, it returns it and the database isn't read. If
   not, it calls `compute` and stores the result with the TTL. An empty result (`null` or
   `undefined`) doesn't go into the cache.

Since `page` and `limit` get fixed up before the key is built, `limit=500` and `limit=100` land on
the same key, `...:limit:100`.

If several requests hit the same key at once and the cache is empty, the database is read once and
the other requests wait for the result. Here's how: `wrap` keeps an in-memory `Map` from a key to
the promise that's computing its value right now. The first request doesn't find the key there,
starts the Redis read and `compute`, and puts its promise in the `Map`. The next requests with the
same key find that promise and just wait for it. Once the promise settles (resolved or rejected),
the key is removed from the `Map`, and the next request goes to Redis again. Since the `Map` lives
in process memory, this only works within one replica: two replicas each hit the database once.

Values are stored as JSON, so anything JSON can't handle comes back from the cache differently: a
`Date` comes back as a string, a `Map` as an empty object.

The cache is also hit by `GET /api/health/ready`: it reads the key `acme:health:probe` and answers
503 if Redis didn't respond within a second or returned an error. Nothing is stored under that key
and nobody writes it: the probe gets an empty answer, and that's fine. All that matters is that
Redis answered and how fast: the response time goes into the probe's response as `latencyMs`.

### Dropping after a write

The catalog is read in `customer-app` but changed in other apps, so they're the ones that drop it,
through the shared Redis and the shared prefix from `CACHE_KEYS`:

| What changes                      | Where                                       | When it's dropped |
| --------------------------------- | ------------------------------------------- | ----------------- |
| updating and publishing a product | the catalog feature in `staff-app`          | after the write   |
| archiving a product               | the `product` core module (`staff-app`)     | after the commit  |
| archiving after a stock write-off | the `product` core module (`processor-app`) | after the commit  |

Every page goes at once, not just the changed ones: one write can shift products across all pages
and change the `total` of each. Keys are deleted with `SCAN` and `UNLINK`, so Redis doesn't block
while it happens. If the write fails, the cache is left alone.

A stale page can still slip through: if it was read right before the write, it can land in the cache
after the drop. Then it lives until its TTL runs out, so the TTL is the most the catalog can lag
behind.

### When Redis is down

Requests don't fail because of it:

- the read failed: the value is computed from the database and returned, without being cached;
- the store failed: the value still goes to the client;
- the drop failed: the product write goes through, and the old pages live until their TTL.

Each of these gets logged as a warning. While Redis is unreachable, commands fail right away instead
of waiting for a reconnect, so a request only gets a few milliseconds slower.
`REDIS_COMMAND_TIMEOUT_MS` is for another case: Redis is connected but not answering.

### Traces

Every cache call has a span: `cache.wrap`, `cache.get` or `cache.delByPrefix`. The attributes hold
the key or prefix, `cache.hit` (hit or not) and `cache.keys_unlinked` (how many keys got deleted).
If Redis let it down and the cache worked around it, `cache.error` says `read`, `write` or `unlink`,
but the span itself stays green, since the client got its answer. Redis commands show up inside as
child spans. In Jaeger a miss looks like `cache.wrap` with `cache.hit=false` and a MySQL query
inside, and a hit has no database query.

### Settings

| Variable                   | Where          | What it sets                                  |
| -------------------------- | -------------- | --------------------------------------------- |
| `REDIS_HOST`, `REDIS_PORT` | all apps       | the Redis address, one for all apps           |
| `REDIS_PASSWORD`           | all apps       | the Redis password                            |
| `REDIS_TLS_CA`             | all apps       | path to the CA for TLS; empty means no TLS    |
| `REDIS_COMMAND_TIMEOUT_MS` | all apps       | timeout of one command, `500` in the examples |
| `CACHE_TTL_MS_DEFAULT`     | `customer-app` | TTL of catalog pages, `60000` in the examples |

The TypeORM query cache is off. If you want to turn it on with `cache: { type: 'ioredis' }`, check
first which ioredis TypeORM expects: it wants version 5, and the template has version 6. Yarn won't
tell you: `.yarnrc.yml` silences that warning (`YN0060`).

### How to cache something of your own

1. Add a key and a versioned prefix to `libs/contracts/src/cache/keys/cache-keys.ts`, for example
   `acme:<area>:v1:`.
2. In the module's `outbound`, add a cache port (a command with `compute` and `ttlMs`) and a token
   for the TTL.
3. In `infrastructure/cache`, write an adapter: it builds the key and calls `CACHE_PORT.wrap`. You
   don't need to write logs or handle Redis failures: `libs/cache` already does that.
4. In the module's `infrastructure/config`, bind the TTL token to a variable, and add the variable
   to the app's Joi schema and env files.
5. Wherever a write makes the value stale, drop the cache through your module's port: in a feature,
   after the write; in a core module, in the transaction's `afterCommit`.

This works when there aren't many keys, since every write wipes them all. The catalog, with no
filters and capped `page` and `limit`, fits; a list with filters and search doesn't.

### How to check it

The easiest way is the Posting collections in `.http/`: they sign the tokens of the right users on
their own, so you don't need to log in. `.http/README.md` says how to run them.

Send `GET /api/products` from the `customer-app` collection
(`.http/customer-app/catalog/get-product-list/01-success.posting.yaml`) twice in a row. The first
request doesn't find the page in the cache, reads it from the database and stores it in Redis; the
second one takes it from the cache. In Jaeger the first one has `cache.wrap` with `cache.hit=false`
and a MySQL query, and the second one has `cache.hit=true` and no database query.

If the first request is already a hit, the page was cached recently: wait a minute (the TTL) or
rename a product in `staff-app` to drop the cache. The `staff-app` collection has
`PATCH /api/catalog/products/102` for that
(`.http/staff-app/catalog/product/update/01-success.posting.yaml`): it sends a new product name as
an editor with the `product:write` permission. Its `If-Match` header is the product version you
expect to see. The request goes through the first time, and the next time it answers 412 because the
version has moved on. Then remove the header (it's optional) or set it to the current version from
the last response.

## Queues

Queues are BullMQ on top of the same Redis as the cache. The apps use them to hand off work that
doesn't have to happen inside the request: writing to the ledger and checking whether a product ran
out after an order. All three apps add jobs, and only `processor-app` runs them.

1. [Which queues there are](#which-queues-there-are)
2. [What happens at startup](#what-happens-at-startup)
3. [How a job gets into a queue](#how-a-job-gets-into-a-queue)
4. [How a job runs](#how-a-job-runs)
5. [When a job fails](#when-a-job-fails)
6. [Scheduled jobs](#scheduled-jobs)
7. [Queue settings](#queue-settings)
8. [How to add a queue of your own](#how-to-add-a-queue-of-your-own)
9. [How to see it by hand](#how-to-see-it-by-hand)

### Which queues there are

| Queue                                    | Who adds jobs                                     | What `processor-app` does                            |
| ---------------------------------------- | ------------------------------------------------- | ---------------------------------------------------- |
| `acme:queue:ledger-append`               | all three apps, after a write                     | writes an entry to the ledger (table `ledger_entry`) |
| `acme:queue:product-stock-post-subtract` | `customer-app`, after an order                    | archives products whose stock dropped to zero        |
| `acme:queue:idempotency-purge`           | `processor-app` itself, on a schedule every 5 min | deletes old and stuck idempotency keys               |

The ledger gets customer sign-ups, orders, product creation, publishing and archiving, and restocks.
Archiving a product that ran out of stock after an order (`processor-app` does it through the
product core module) lands in the ledger as a regular `product-archived` with the order's
correlation id.

The shared queues (`acme:queue:ledger-append`, `acme:queue:product-stock-post-subtract`) are defined
in `core/queues`, and the shape of their jobs in `@acme-core/contracts`, where every app can see
them. A queue that only one processor knows about lives in that processor's `queues/` folder, like
`acme:queue:idempotency-purge`.

### What happens at startup

`AppSetupBaseModule` wires BullMQ into all three apps: the Redis address and password from
`REDIS_*`, the key prefix from `QUEUE_PREFIX` and the shared retry settings (more on those below).
Each module that adds jobs registers its queue itself, next to its adapter.

Only `processor-app` has workers (`@Processor`), so only it takes jobs. `customer-app` only adds
jobs, and `staff-app` also reads the queues through `/api/queues` (more on that below), but neither
runs jobs. If `processor-app` isn't running, jobs just pile up in Redis and run once it's back.

At startup `processor-app` also registers the schedule of the idempotency key purge. If that fails,
the app doesn't start.

### How a job gets into a queue

Take an order, `POST /api/orders` in `customer-app`:

1. The order, its lines and the stock movements are written in one transaction.
2. After the commit, an `order-placed` entry goes to `acme:queue:ledger-append`, and the order's
   products go to `acme:queue:product-stock-post-subtract` to have their stock checked.
3. The job carries the request's correlation id, so everything `processor-app` does with it later
   shows up in the logs under the same id.

A job is added only after the commit: if the transaction rolls back, no job ends up in the queue for
a write that never happened. Where the feature opens the transaction itself, the job is added on the
next line after it; where a core module writes inside someone else's transaction, it goes through
`afterCommit`.

Unlike the cache, the queue client waits for Redis while it's down. So that the request doesn't
hang, each add is capped at `REDIS_COMMAND_TIMEOUT_MS` and retried up to `ENQUEUE_RETRY_ATTEMPTS`
times. If that doesn't work, the write stays in the database, and an error goes to the log with the
correlation id and what you need to add the job again by hand: the subject and the operation key for
the ledger, the products for the stock check.

A ledger job is deduplicated by its operation key (for example, `order-placed:<id>`): while a job
with that key is waiting or running, a second identical one doesn't get into the queue. And if one
does get in later, the ledger won't write the entry twice.

### How a job runs

`processor-app` takes a job, opens a context with its correlation id and calls its case:

- a job from `acme:queue:ledger-append`: the processor writes an entry to the `ledger_entry` table
  in MySQL. If an entry with that operation key already exists, it writes nothing and logs that the
  entry was already there;
- a job from `acme:queue:product-stock-post-subtract`: in one transaction, the processor locks the
  stock of the job's products and archives the ones that are still active but have zero or less in
  stock. Archiving goes through the product core module, so it also drops the catalog cache and
  sends `product-archived` to the ledger.

Jobs aren't validated: the template's own apps add them, typed by the contract. If you change the
shape of a job, old jobs still in Redis are read the old way until they run out.

### When a job fails

If the case throws, BullMQ retries the job: 3 attempts in total, the second one after a second, the
third after two. Every failed attempt is logged: as a warning while attempts are left, as an error
after the last one. A job that ran out of attempts stays in Redis among the failed ones.

Failed jobs are looked at and handled through `/api/queues` in `staff-app`:

| Route                                                  | Permission     | What it does                                    |
| ------------------------------------------------------ | -------------- | ----------------------------------------------- |
| `GET /api/queues`                                      | `queue:read`   | the queues, their pause and job counts by state |
| `GET /api/queues/:queueName/jobs/failed`               | `queue:read`   | the failed jobs, newest first                   |
| `POST /api/queues/:queueName/jobs/failed/:jobId/retry` | `queue:retry`  | returns the job to the queue                    |
| `DELETE /api/queues/:queueName/jobs/failed/:jobId`     | `queue:delete` | deletes the job                                 |

In `:queueName` the queue goes without the prefix: `ledger-append`, not `acme:queue:ledger-append`.
With the prefix the route answers 404 `QUEUE_NOT_FOUND`.

Returning a job gives it one more attempt, not three new ones: if it fails again, it's back among
the failed ones. Deleting logs the job's data: for a ledger entry, that's the last place it can be
restored from. `acme:queue:idempotency-purge` isn't on the list: its failures don't fail the job,
more on that below.

### Scheduled jobs

The idempotency key purge is started by BullMQ, not by a timer in the process. At startup every
replica of `processor-app` registers the schedule `*/5 * * * *` under the same id, so Redis holds
one schedule no matter how many replicas there are, and every 5 minutes exactly one of them runs the
purge.

The purge deletes keys older than `IDEMPOTENCY_KEY_TTL_HOURS` and keys stuck "in flight" longer than
`IDEMPOTENCY_IN_FLIGHT_TTL_MINUTES` (their holder died before it could release them). If the purge
fails, it logs a warning and completes anyway: the next one tries again in 5 minutes.

### Queue settings

| Variable                            | Where           | What it sets                                                    |
| ----------------------------------- | --------------- | --------------------------------------------------------------- |
| `QUEUE_PREFIX`                      | all apps        | prefix of the queue keys in Redis, `acme:queue` in the examples |
| `ENQUEUE_RETRY_ATTEMPTS`            | all apps        | how many times to try adding a job, `3` in the examples         |
| `REDIS_COMMAND_TIMEOUT_MS`          | all apps        | how long to wait for one attempt to add a job                   |
| `IDEMPOTENCY_KEY_TTL_HOURS`         | `processor-app` | how long an idempotency key lives, `24` in the examples         |
| `IDEMPOTENCY_IN_FLIGHT_TTL_MINUTES` | `processor-app` | when a stuck key gets released, `5` in the examples             |

`QUEUE_PREFIX` has to be the same in every app of one environment, otherwise an app adds jobs where
`processor-app` doesn't look for them. The e2e suites have their own prefix, `acme-e2e:queue`: a
local run and the e2e share one Redis, and without it a local `processor-app` would grab the jobs of
the tests.

The number of attempts (3) and the delays between them aren't variables but a constant in
`libs/queue/src/bull/bull-setup.module.ts`. Several apps write to a shared queue, and if each one
took the number of attempts from its own `.env`, the same jobs would be retried differently.
Completed jobs are removed from Redis.

### How to add a queue of your own

1. If the queue is shared, add its class to `core/queues/src/definitions` (the name and
   `register()`) and the job type to `@acme-core/contracts`; if it's only needed in `processor-app`,
   put it in its processor's `queues/`.
2. In the module that adds jobs, write an adapter in `infrastructure/queue`: it injects the queue
   with `@InjectQueue` and adds the job with a time limit. Register the queue in the module root,
   next to the adapter.
3. Add the job after the commit and retry it with `ReplayRetryHelper`, the way the ledger does.
4. In `processor-app`, add a processor: a class extending `WorkerHost` with
   `@Processor(<queue name>)` that opens a context with the job's correlation id and calls the case.
   For failed attempts, use `@OnWorkerEvent('failed')`.
5. Make the processing safe to repeat: the same job can arrive twice.
6. If failed jobs need handling by hand, register the queue in the `queue` module of `staff-app` and
   add it to `QueueRegistryAdapter`.

### How to see it by hand

You need `customer-app`, `staff-app` and `processor-app` running. With the Posting collections in
`.http/`:

1. Send an order, `.http/customer-app/order/place/01-success.posting.yaml`. Its idempotency key is
   fixed, so for a second order change `Idempotency-Key`, otherwise you get the first response back.
2. Look at the ledger: `.http/staff-app/ledger/get-many/03-correlation-filter.posting.yaml` with the
   order's `correlationId` shows the `order-placed` entry. If it isn't there and `processor-app` is
   running, check `QUEUE_PREFIX` in all three apps.
3. `.http/staff-app/queue/get-many/01-success.posting.yaml` shows the job counts. Stop
   `processor-app` and send another order, and you'll see jobs in `waiting`; once `processor-app`
   starts, they run.
