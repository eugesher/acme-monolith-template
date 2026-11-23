# 016 — Lint allowlists

Every `allow` entry of a policy in `lint/boundaries/policies/` is a dependency the code has. An
entry no file uses is removed, unless it is kept on purpose for one of the reasons below.

**A forbidden edge is pinned by a spec.** An edge the code must not have keeps one negative case,
with the reason in its name, and the case fails against a policy that allows the edge. The case
lives with the rule that covers the importer:

- **in the spec of the layer** when the layer has a positive case for where the code belongs:
  `features.spec.ts` says the module root may NOT reach its own outbound, because infrastructure
  binds the tokens, and that a use case may NOT take the config lib, next to the case where
  `infrastructure/config` may; `app-global.spec.ts` and `libs-by-layer.spec.ts` do the same for
  global modules and for the libs of each layer;
- **in `spec/architecture/unused-edges.spec.ts`** when no layer spec covers the importer: the app
  module may NOT import `typeorm`, because the database lib configures it.

**An edge used only by specs counts as used.** A lib module spec imports `@nestjs/core`, and a
common-module spec imports the kernel; both are code the lint checks.

**No rule names an app.** A category matches `apps/*` and captures the folder as `app`, a policy
compares it with `own('app')`, and the import groups of `imports.mjs` match any `@acme-<app>` alias
but the libs and the core. An app may take any name, and a new app gets the same rules without an
edit of the lint.

**Every file of `apps`, `core` and `libs` has a category.** `boundaries/no-unknown-files` runs on
those three folders only, so a folder outside the layout of an app, such as `apps/<app>/src/utils/`,
fails lint, while a new top-level folder of the repository, such as `tools/`, does not. The code of
the three folders still may not import a file outside every category
(`boundaries/no-unknown-dependencies`).

## Why an edge without a use stays

### `policies/selectors.mjs` — the base libs

`baseLibs(...names)` is `libs('kernel', 'toolkit', 'domain', ...names)`. The kernel is the
vocabulary, the toolkit is the technique of every layer and the domain lib holds the bases of the
domain models and exceptions (`Entity`, `VersionedEntity`, `ValueObject`, `DomainException`), so
each layer gets all three whether or not one of its files imports them. The names after them are
what the layer adds: `baseLibs('observability')` for an application layer,
`baseLibs('auth', 'credentials', 'health', 'http')` for the module root of a feature.

`main.ts` and the core entities are the exceptions: they list their libs one by one.

### A layer may import itself

A layer split over several files imports its own files. The entry stays even where every layer of
that kind is one file: the module root of a common or core module, the application and outbound of a
global module.

### Positive cases of the architecture specs

Some edges are part of the documented shape of the template and have a `MAY` case in
`spec/architecture/`, even though no file uses them:

- the index of nested features and processors, and the module roots that mount through it;
- a bootstrap file that mounts the features, processors and global modules through their indexes;
- a global module that reaches app contracts, common modules, the entities and the database
  contracts;
- shared code that reaches the contracts of its namesake, the http lib, the cache contracts and
  `nestjs-pino`;
- the e2e code that reaches app contracts, the queue contracts `@acme-core/contracts/ledger` and
  `@acme-core/contracts/product-stock`, and the testing lib;
- a feature queue adapter and a processor that reach app contracts: a queue between the modules of
  one app keeps its contract in the app, while a queue written by more than one app keeps it in core
  or in the lib that writes it, `product-stock-post-subtract` in
  `@acme-core/contracts/product-stock` and `ledger-record` in `@acme-core/contracts/ledger`;
- the core-adapters and common-adapters of a common module, and a common module root that mounts a
  core module, another common module or a shared barrel;
- the core-adapters of a core module, and a core module root that mounts another core module;
- a processor whose application reaches its domain, and the libs of the processor layers: the
  database contracts and the entities;
- the libs a layer is meant to reach: the cache lib from the app root, the auth lib from a feature
  root, the database contracts from the infrastructure of a common module;
- a script, a migration or a seed script that imports its own support files.

Removing one of them turns its spec red.

### `module-areas.mjs` — processors share the layer model of features

Features and processors are built by one function, `areaPolicies`, over the layers of
`categories/module-layers.mjs`. A processor has no `presentation`: it takes no request, so it has no
DTO and no filter. It uses fewer of the other layers too: `idempotency-purge` has a domain helper
and a repository, `ledger-append` neither. The entries stay, so a processor that grows a layer
follows the same rules a feature does.

**The shell holds the entries of a module.** The Nest module and the controller of a feature, or the
Nest module and the processor of a processor, sit in `shell/`, and the root of the module holds only
`index.ts`, which re-exports the Nest module. Lint gives the two kinds of file of `shell/` the
rights they had before the move: `shell/*.module.ts` (`<area>:shell:module`) mounts and binds, and
sees the application, the infrastructure, the controller or processor next to it, and the shared and
module barrels; the rest of `shell/` (`<area>:shell`) is the controller or processor with its spec,
and sees the domain, the application, the `presentation` of a feature and the HTTP or queue
packages. A module root binds, so it does not see `presentation`; a DTO is the input of a
controller, so `presentation` does not see the application. The root barrel sees only the Nest
module in `shell/` and, in a parent feature, `modules/index.ts`: a parent keeps its Nest module at
its root, next to `modules/` (see `025-feature-groups.md`).

`infrastructure/queue` of a processor may inject a queue to manage its jobs, as the idempotency
processor upserts its job scheduler (see `009-scheduled-processor.md`). The module next to the
adapter takes `libs/queue` or `@acme-core/queues` to register the queue, in features and processors
alike. The processor in `shell/` takes the name of its queue from its own `outbound` for
`@Processor`, and `queue.mjs` keeps it to `*_QUEUE` names, so a port still reaches the processor
only through a use case. The module root of a processor without a queue adapter, as the ledger,
mounts its registration from `@acme-core/queues`.

The module root of a feature or a processor may reach a shared barrel, as the module root of a
common module may (a positive case of the common modules spec).

### `module-areas.mjs` and `common-modules.mjs` — the two adapter kinds

A core-adapter and a common-adapter have the same shape: they implement an outbound port of their
module and call a contract outside it. Both may reach the outbound layer of their module and never
its domain.

**Outbound does not see the domain.** A port speaks types of its own: a command lists the fields its
adapter reads, and the use case hands it what the model answers, which fits by shape
(`IOrderProductStockWithdrawCommand.movements`, `IProductLedgerRecordPublishedCommand.payload`). A
domain type in a command would let infrastructure, which may not import the domain, hold domain
objects and call their methods. The features, core modules and common modules specs each refuse the
edge.

### `acme-core.mjs` — a core module that writes to a queue or a cache

A core module announces what it wrote after the commit (see `026-transaction-port.md`), so three
edges exist for it:

- **`infrastructure/queue`**, a category of its own, holds the queue adapters. It takes
  `@nestjs/bullmq`, `bullmq` and its own contracts.
- **The module of a queue adapter registers its queue** from `@acme-core/queues`, and the module
  root mounts that module and takes neither `@acme-core/queues`, `libs/queue` nor BullMQ itself. A
  core module is mounted by features of several apps, so the queue comes with it rather than with
  each app.
- **Core infrastructure may take `@acme-libs/contracts/cache`**, to drop the keys a write makes
  stale; the application still may not, so caching stays an adapter behind a port.

### `acme-core.mjs` — a core module that calls another core module

A core module reaches another one the way a feature does: through its contracts. Its
`infrastructure/core-adapters`, a category of its own, implements an outbound port of the module on
top of the port in `@acme-core/contracts/<other>` and takes nothing else of the other module. The
module root mounts the other module through its barrel `@acme-core/modules/<other>`, and only the
barrel. The application, the domain and the facade still see only their own contracts, so a core
module depends on another one only through an adapter its infrastructure binds. Lint does not see a
cycle between two core modules; Nest refuses to start on one.

**Core outbound takes the contracts of its own module.** A port of the ledger hands its queue
adapter the record that `@acme-core/contracts/ledger` defines for the queue, so the outbound of a
core module may import its own contracts, as the outbound of a lib does. The contracts of another
module stay with its core-adapters.

### Where the credentials and the persistence packages are allowed

Code lives with its only caller (see `024-code-placement.md`), so the edges follow the code:

- **A feature signs users in, a global module checks the token.** The `infrastructure/lib-adapters`
  of a feature may take `@acme-libs/contracts/credentials`: the `auth` features of staff-app and of
  customer-app, and the `user` feature of staff-app for the hash of a new password. So may the
  `infrastructure/lib-adapters` of a global module, which verify the bearer token for the guard.
  Only `app/setup/app-setup.module.ts` may mount `@acme-libs/credentials`, once for the app (see
  `017-credentials-lib.md`): a feature that mounted it too would build a second module with its own
  `JwtModule` and password hasher. No core or common module signs anyone in, so none may.
- **A lib port is reached through a lib adapter.** A feature or a global module declares a port of
  its own in `outbound` and implements it in `infrastructure/lib-adapters` on top of the port of the
  lib, as `core-adapters` and `common-adapters` do for core and common modules. Only `lib-adapters`
  may take `@acme-libs/contracts/credentials` and `@acme-libs/contracts/health`; the application,
  the presentation and the controller may not. The types of `@acme-libs/contracts/auth` stay direct.
- **A feature and a core module write to the ledger** as to any core module: the module root mounts
  `LedgerCoreModule` of `@acme-core/modules/ledger`, and `infrastructure/core-adapters` takes
  `LEDGER_CORE_PORT` from `@acme-core/contracts/ledger`. The ledger reads the correlation id of the
  context itself, so no adapter needs the observability lib. What reads the queue takes the same
  contracts, as it takes those of any core module: the processor in `shell/`, the queue registry of
  staff-app in `infrastructure/queue`, `core/queues`, the e2e code and `test/system`.
- **A processor and a global module read tables.** Their infrastructure may import `typeorm`,
  `@acme-libs/contracts/database` and `@nestjs/common`, as feature infrastructure does.
- **No module touches `@nestjs-cls`.** A repository injects `ORM_PORT` of
  `@acme-libs/contracts/database` and reads through `getRepository(<Entity>)`, so infrastructure may
  not import `@nestjs-cls/transactional` or its TypeORM adapter; only `libs/database` and
  `libs/local-storage` do. Only infrastructure takes `TRANSACTION_PORT` from
  `@acme-libs/contracts/local-storage`, in the transaction adapter of its module; the application
  reaches it through the port of the module (see `026-transaction-port.md`).
- **Infrastructure does not see `libs/database`.** A repository takes `ORM_PORT` from
  `@acme-libs/contracts/database` and `MysqlErrorHelper` from the toolkit. `OrmModule` of
  `libs/database` binds `OrmFacade` under the port, so infrastructure cannot inject the facade past
  it. The http lib reads `MysqlErrorHelper` from the toolkit too.
- **`toolkit/src/database` may import `typeorm`.** `MysqlErrorHelper` checks for a TypeORM
  `QueryFailedError`. The edge is scoped to that folder by the `file` capture of the lib category,
  so the rest of the toolkit sees only `crypto`, and the domain lib and the kernel see no package.
- **The database contracts name TypeORM.** The ORM port returns a TypeORM `Repository`, so the
  contracts of `database` may import `typeorm`; the other contracts see only the base libs.
- **No module registers entities.** The entities of an app are listed once in `app/setup/entities`
  and handed to `OrmModule.forRoot` of `libs/database`, so only that lib may import
  `@nestjs/typeorm`; `TypeOrmModule.forFeature` would add repository tokens that nothing injects.
  `libs/app` takes `TypeOrmModuleOptions` from it as well, for the type of the entities it hands to
  `OrmModule`.
- **One file sets an app up.** `app/setup/app-setup.module.ts` is the category `acme-app:app:setup`:
  it may import `@acme-libs/app`, `@acme-libs/credentials`, the base libs, the files of its own
  `app/` and `@nestjs/common`. `AppModule` reaches only that file, the indexes of the features,
  processors and global modules and `@nestjs/common`, and the rest of `app/` reaches neither lib.
  `libs/app` holds two parts behind one root, so `main.ts` and the app setup import `@acme-libs/app`
  alike, and the `file` capture keeps an allowlist per part: `setup/` takes the libs it mounts,
  `cache`, `database`, `http`, `local-storage`, `observability` and `queue`, and `@nestjs/core` for
  `APP_PIPE` and `APP_FILTER`; `bootstrap/` takes `observability`, `openapi`, `@nestjs/config` and
  `nestjs-pino` to start the app (see `012-app-bootstrap.md`).
- **A module root binds no token.** An adapter carries its binding in a static `provider` (see
  `031-static-provider.md`), and a config value is bound in `infrastructure/config` (see
  `030-config-values.md`), so the module root of a feature, a processor, a core, common or global
  module may reach neither its own `outbound` nor `@acme-libs/config`. Only `infrastructure/config`,
  `app/setup/config` and the observability lib import the config lib. `infrastructure/config` and
  `core/queues` also take `@nestjs/common`, for the type of the constants they export:
  `FactoryProvider` and `DynamicModule`.
- **A global module has the layers of a feature.** `application/` sees its own outbound, the base
  libs and `@nestjs/common`; `outbound/` sees itself and the base libs; the module root sees the
  application.
- **A global common-adapter reaches any contract of its app and its own outbound.** It implements a
  port of its module's outbound with the port of a common module, which is named after that module,
  not after the global module, so the namesake rule of `appContracts` would refuse it.
- **A global lib-adapter reaches the `credentials` contract and its own outbound.** It implements a
  port of its module's outbound with the port of a lib, as the lib-adapters of a feature do:
  `AuthGlobalCredentialsLibAdapter` verifies the bearer token with `CREDENTIALS_PORT`. The shell of
  a global module takes the `auth` contract, its common-adapters take no lib contract, and the rest
  of the global infrastructure takes only that of `database`. Each layer names the contracts it
  uses, so a new lib contract reaches a global module only through a new policy.

### No policy names an export

A policy allows a layer other layers, libs and packages, never a list of the names they export.
Which decorator or type a layer takes from a package it may import is the choice of the code: a core
service may implement `OnModuleInit`, a processor may throw `UnrecoverableError`, a queue adapter
may pass `JobsOptions`. A list of names would turn each of them into an edit of the lint.

One policy still names imports: `queue.mjs` keeps the processor in `shell/` to the `*_QUEUE` names
of its own `outbound`, so that a port reaches it only through a use case. The specifier is a pattern
of the naming of `029-naming.md`, not a list of exports.

### The layers of a lib

A lib with a port has the layers of a core module: `shell`, `application`, `outbound` and
`infrastructure`, in `src/` (`libs/cache`, `libs/credentials`, `libs/health`) or in a part of the
lib (`libs/database/src/orm`, `libs/local-storage/src/transactional`). Every file of a lib is one
category, `acme-libs`, so its edges to other libs and packages stay per lib.
`policies/lib-layers.mjs` gives every layer file an allowlist within its lib from the `file`
capture; the files outside the layers may reach the whole lib:

| Layer            | May reach                                |
| ---------------- | ---------------------------------------- |
| `shell`          | `shell`, `application`, `infrastructure` |
| `application`    | `application`, `outbound`                |
| `infrastructure` | `infrastructure`, `outbound`             |
| `outbound`       | `outbound`                               |

A shell spec may also read the tokens of `outbound` it overrides. In `libs/database`, `orm/shell`
may reach `naming` and `orm/application` may reach `repository`.
`spec/architecture/lib-layers.spec.ts` holds a case per edge.

### The testing lib is for tests only

`libs/testing` holds the test helpers behind one barrel, `@acme-libs/testing`: `E2EContext` of
`e2e/e2e.context.ts` and `AuthE2EContext` of `e2e/auth-e2e.context.ts`, the Redis token of `cache/`
and the logger mock of `observability/pino-logger.mock.ts`. Any `*.spec.ts` may import it, through a
policy that matches the path, and so may the e2e code and `test/system`; no layer of production code
lists it, so lint refuses it there. The lib reaches the `outbound` of the cache lib for the Redis
token and the app lib for `AppBootstrap`, and nothing else of another lib.
