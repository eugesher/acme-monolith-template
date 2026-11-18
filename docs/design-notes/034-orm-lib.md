# 034 — ORM lib

The connection of an app and the repositories its modules read through live in `libs/database`:

| Part          | Entry                         | What it gives the app                                             |
| ------------- | ----------------------------- | ----------------------------------------------------------------- |
| `orm/`        | `OrmModule.forRoot(entities)` | the TypeORM connection, the transactions, global `ORM_PORT`       |
| `repository/` | `HostedRepository`            | the repository a module gets: six TypeORM methods and two inserts |
| `naming/`     | `SnakeNamingStrategy`         | snake_case names of tables and columns, for the app and its e2e   |

`AppModule` hands `OrmModule.forRoot` the entities of `app/entities` and nothing else (see
`012-app-bootstrap.md`).

## `orm/`

The part has the shape of `libs/cache` (see `010-cache-aside.md`):

| Layer            | What it holds                           |
| ---------------- | --------------------------------------- |
| `shell`          | `OrmModule`, `OrmFacade`                |
| `application`    | `OrmGetRepositoryUseCase`               |
| `outbound`       | `ORM_HOST_PORT`                         |
| `infrastructure` | `OrmHostAdapter` over `TransactionHost` |

`forRoot(entities)` returns a global module that binds `OrmFacade` under `ORM_PORT` and imports the
connection from the private `forRootAsync(entities)`, which returns `TypeOrmModule.forRootAsync`
with the options built from the `DATABASE_*` variables, `DATABASE_LOGGING` and `DATABASE_SSL_CA`:
MySQL, no `synchronize`, `timezone: 'Z'`, `utf8mb4` and `SnakeNamingStrategy`.

**The pool is bounded twice.** `DATABASE_POOL_SIZE` becomes `poolSize`, the `connectionLimit` of the
mysql2 pool. `DATABASE_POOL_QUEUE_LIMIT` becomes `extra.queueLimit`, the number of queries that may
wait for a free connection; mysql2 has no timeout for that wait, so the limit is what keeps a query
from waiting forever. A query past the limit fails at once with `Queue limit reached.` and the
request answers 500. `0` lifts the limit, as mysql2 does by default.

**The adapter answers the raw repository, the use case shapes it.** `OrmHostAdapter` answers
`TransactionHost.tx.getRepository(entity)`, the TypeORM repository bound to the manager and the
query runner of the current transaction, or of no transaction outside `TRANSACTION_PORT.run`.
`OrmGetRepositoryUseCase` wraps it into a `HostedRepository` over the same target, manager and query
runner. Everything that names `@nestjs-cls` stays in the adapter, and what a module may call on a
repository is decided in the application.

**The repository is read on every call.** A persistence host takes `orm.getRepository(<Entity>)` in
a getter, never in its constructor, so every query joins the transaction open at that moment (see
`026-transaction-port.md`). The wrapper is built anew on every call and holds no state of its own.

## `OrmModule` mounts the transactions

`OrmHostAdapter` needs `TransactionHost`, which only the plugin of `LocalStorageTransactionalModule`
provides, and the plugin needs the `DataSource` of the connection. `OrmModule.forRoot` imports
`LocalStorageTransactionalModule.forRoot()` itself, so an app cannot mount the connection without
the transactions, and the order is set by the import, not by the `AppModule` of each app. The root
`ClsModule` stays with the app: `LocalStorageSetupModule` comes before `OrmModule` (see
`033-local-storage-lib.md`).

The edge goes one way: `libs/database` may import `libs/local-storage`, and `libs/local-storage` may
not import `libs/database`.

## The contract

```ts
interface IOrmPort {
  getRepository<Entity extends ObjectLiteral>(
    entity: EntityTarget<Entity>,
  ): IHostedRepository<Entity>;
}
```

`ORM_PORT` and `IHostedRepository` live in `@acme-libs/contracts/database`, the only contracts that
may import `typeorm`. The persistence host of a module injects the port in its constructor, and
every repository of the module reads through it:

```ts
export abstract class ProductPersistenceHost {
  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}
}
```

**A repository declares no constructor.** It extends the host, directly or through a base
repository, and carries only its `provider` and its methods. Nest reads the parameters of a class
through its prototype chain: TypeScript and the SWC loader of the build put `design:paramtypes` and
the token of `@Inject` on the host, and a class without a constructor has none of its own, so the
repository gets `ORM_PORT` from the host. A repository that needs another dependency declares its
own constructor and hands `orm` to `super`.

The port exposes `getRepository` alone, and the repository it answers has no manager, so a
repository can neither open a transaction nor reach the `DataSource` directly.

**The repository a module gets is narrow.** `IHostedRepository` picks `createQueryBuilder`,
`insert`, `update`, `delete`, `softDelete` and `existsBy` from the TypeORM `Repository` and adds
`insertOne` and `insertReturning`. `manager`, `query`, `save` and the `find` methods stay out, so a
repository sends no raw SQL and reads through the builders of its persistence host. A method a
repository starts to need is added to the pick. The builder that `createQueryBuilder` answers still
holds the connection: the pick closes the direct path, not every path.

**The driver stays in the lib.** mysql2 answers a `bigint` id as a number or a string and a `SUM` as
a `DECIMAL` string. `insertOne` answers the generated id as a string. `insertReturning(entities)`
answers `{ id, createdAt }` for every inserted row, the id as a string and `createdAt` as TypeORM
read it back into `generatedMaps`, and sends nothing for an empty list; it is for an entity with a
`CreateDateColumn`. A raw row is converted by the repository that reads it: core
`ProductStockCoreBaseRepository.sumStock` turns the sum into a number. Nothing past a repository
sees `number | string`.

## Who sees the lib

| Importer                                | Uses                                       |
| --------------------------------------- | ------------------------------------------ |
| `app.module.ts`                         | `OrmModule.forRoot(entities)`              |
| infrastructure of the apps and the core | `ORM_PORT`, `IHostedRepository`            |
| `test/` of staff-app                    | `SnakeNamingStrategy` for the schema check |

Infrastructure takes the contracts, never the lib (see `016-lint-allowlists.md`). The lib itself
sees `libs/local-storage`, `@nestjs/common`, `@nestjs/config`, `@nestjs/typeorm`, `typeorm` and the
transactional packages of `nestjs-cls`.
