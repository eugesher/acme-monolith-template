# Acme Monolith Template

Three NestJS apps on one MySQL and one Redis: `staff-app` (port 3000), `customer-app` (port 3001)
and `processor-app` (port 3002).

## What you need

- Node 26.13 or later
- Docker with Compose

If you don't have the right Node version, install it with [nvm](https://github.com/nvm-sh/nvm):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.41.0/install.sh | bash && source ~/.nvm/nvm.sh # if you don't have nvm yet
nvm install # reads the version from .nvmrc
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

With the test infrastructure running, create the schema. Later you apply new migrations with the
same command:

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

## E2E tests

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
