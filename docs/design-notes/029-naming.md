# 029 — Naming

A name says who or where; the action lives in the method or in the port.

| Element                            | Name                                                                                                                                                    | Example                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| port of a core or lib module       | `I<Module><Layer>Port`, `<MODULE>_<LAYER>_PORT`, `<module>-<layer>.port.ts`; a lib names no layer                                                       | `IIdempotencyCorePort`, `ICachePort`                       |
| facade of that module              | `<Module><Layer>Facade`, `<module>-<layer>.facade.ts`                                                                                                   | `IdempotencyCoreFacade`, `CacheFacade`                     |
| facade method                      | `handle<Action>`                                                                                                                                        | `handleClaim`, `handleSignAccessToken`                     |
| use case held by a facade          | `<action>`, without the context                                                                                                                         | `claim: IdempotencyCoreClaimUseCase`                       |
| domain exception codes             | `<Context>ExceptionCodeEnum`, `<context>-exception-code.enum.ts`                                                                                        | `OrderExceptionCodeEnum`                                   |
| queue adapter                      | `<Context><Target>QueueAdapter`, `<context>-<target>-queue.adapter.ts`                                                                                  | `ProductStockCorePostSubtractQueueAdapter`                 |
| queue of one processor             | `<Module>Queue` with `NAME` and `register()`, `queues/definitions/<module>.queue.ts`; `I<Module>QueuePayload`, `queues/types/<module>-queue.payload.ts` | `IdempotencyPurgeQueue`, `IIdempotencyPurgeQueuePayload`   |
| transaction port of a module       | `I<Module>TransactionPort`, `<MODULE>_TRANSACTION_PORT`, `<module>-transaction.port.ts`                                                                 | `IRoleTransactionPort`, `ROLE_TRANSACTION_PORT`            |
| transaction adapter                | `<Module>TransactionAdapter`, `persistence/transaction/<module>-transaction.adapter.ts`                                                                 | `RoleTransactionAdapter`                                   |
| outcome of a repository write      | `<Port><Subject><Method>OutcomeEnum`, `<port>-<subject>-<method>-outcome.enum.ts`                                                                       | `RoleCreateStaffRoleInsertOutcomeEnum`                     |
| commands of a service              | `I<Context><Service><Method>Command`, one file `<context>-<service>.command.ts`                                                                         | `IProductAccessLoadCommand` in `product-access.command.ts` |
| token of a config value            | `<MODULE>_<PROPERTY>_TOKEN`, `<module>-<property>.token.ts`                                                                                             | `PRODUCT_OCC_RETRY_ATTEMPTS_TOKEN`                         |
| binding of an infrastructure class | `public static readonly provider: ClassProvider<I…Port>`; a queue adapter is bound by its module (`031-static-provider.md`)                             | `OrderIdempotencyCoreAdapter.provider`                     |
| provider of a config value         | `<Module>Config<Property>Provider`, `<module>-config.provider.ts`                                                                                       | `ProductConfigOccRetryAttemptsProvider`                    |
| type file of a lib without layers  | role suffix where the type has one, else `.interface.ts` or `.type.ts`                                                                                  | `replay-retry.options.ts`, `utility.type.ts`               |
| options of a helper method         | `I<Subject><Action>Options`, `<subject>-<action>.options.ts` next to the helper                                                                         | `IPageWindowClampOptions`, `IPageBuildOptions`             |
| answer of a helper method          | `I<Subject>`, `<subject>.interface.ts` next to the helper                                                                                               | `IPageWindow`, `IPage`                                     |

**A module with one port names it after the module.** The port, its token and its facade carry the
name of the module and its layer (`Core`, `Common`) and nothing else, so a consumer finds the facade
of `@acme-core/contracts/idempotency` under `IdempotencyCoreFacade` without knowing what the module
stores. A lib names no layer, since its import path `@acme-libs/<lib>` already says where it lives:
`CACHE_PORT`, `CacheFacade`, `CacheModule`. The one exception is the health lib: every app has a
`HealthModule` of its own, the feature that serves the health routes and imports the module of the
lib, so the lib module is `HealthLibModule`, and every name of the lib takes the same prefix to
follow its module: `HealthLibFacade`, `HealthLibCheckReadinessUseCase`, `HEALTH_LIB_UPTIME_PORT`,
`health-lib-uptime.adapter.ts`, and so do its contracts in `libs/contracts/src/health`:
`HEALTH_LIB_PORT`, `IHealthLibReadinessView`, `health-lib.port.ts`. The folders and the alias keep
the name of the lib, `@acme-libs/contracts/health`.

**A facade method is `handle<Action>`, its use case is `<action>`.** The facade forwards each method
to one use case. The field that holds the use case takes the action alone, because its type already
names the context: `CredentialsSignAccessTokenUseCase` is `signAccessToken`, not
`credentialsSignAccessToken`. The prefix `handle` keeps the method apart from that field, so
`handleSignAccessToken` calls `this.signAccessToken.execute(command)` in the same class. Where the
method and the use case name the action differently, each keeps its own: `handleReadiness` calls
`checkReadiness`, `handleValidate` calls `validateSubject`.

**A route and a processor follow the same rule.** `ProductController.handleGetMany` calls
`this.getMany.execute(command)`, `HealthController.handleLiveness` calls `liveness`, and the e2e
class of a feature names its methods after the handlers they test, `healthE2E.handleLiveness()`. The
handler builds the command field by field from the request DTO and the caller,
`const { id: authorId } = user`, and never hands the DTO on, so a field that a DTO gains does not
reach the use case unseen.

**Exception codes are named after the exceptions.** The enum lists the values of `code` on the
`<Context>BaseException` subclasses of a module and the exception filter maps them to HTTP statuses,
so the enum takes the word `Exception`, not `Error`. `IdentityExceptionCodeEnum` in `libs/kernel`
serves the identity exceptions of several apps the same way.

**The folder of the exceptions takes the word of the API.** A domain keeps its exceptions and their
codes in `domain/errors`: `exceptions/` holds the classes and their `base/`, `codes/` the enum, and
`errors/index.ts` exports both. The client gets an error body with an error code (see
`039-api-surface.md`), so the folder says `errors`, while the files keep the word of the code they
hold, `Exception`. The identity domains have no `codes/`, since their codes are
`IdentityExceptionCodeEnum`. From outside the folder an import goes through its barrel, as it does
for `types/`: `lint/syntax/barrel-bypass.selectors.mjs` refuses a path into `codes/` or
`exceptions/` of `errors/` and into any subfolder of `types/`. A folder of types without subfolders,
as in `libs/config/src/provider`, has no barrel, so a file path to it stays, and so does a path into
`libs/http/src/errors`, which holds the error body of the HTTP lib, not the exceptions of a domain.

**A layer keeps its types in `types/`.** The interfaces lie in a subfolder per role, `commands/`,
`queries/`, `records/`, `views/`, `data/` or `snapshots/`, and the enums of the same layer in
`types/enums/`, so the barrel of `types/` exports both and a caller imports an outcome and the
record that carries it from one path. An enum folder with no interfaces beside it stays on its own,
as `libs/http/src/throttle/enums`. `libs/auth` sorts its two types the same way, the request a guard
reads in `types/requests/` and its metadata keys in `types/enums/`.

**A queue adapter is named by where it sends.** The adapter is transport to a target, so a target
with a compound name keeps it whole: `ProductStockCorePostSubtractQueueAdapter` sends to the
post-subtract queue.

**An adapter to a lib or a core module is named by the port and the target.**
`AuthCredentialsLibAdapter` implements `IAuthCredentialsPort` in
`infrastructure/lib-adapters/auth-credentials-lib.adapter.ts`, and `OrderLedgerCoreAdapter`
implements `IOrderLedgerPort`, `ORDER_LEDGER_PORT`, in
`infrastructure/core-adapters/order-ledger-core.adapter.ts`.

**The commands of a service live in one file named after the service.** A service of
`application/services` takes its commands from
`application/types/commands/<context>-<service>.command.ts`, next to
`<context>-<service>.service.ts`. Each command is named after the service and the method that takes
it, `I<Context><Service><Method>Command`. A port follows the same rule in `outbound/types`:
`IProductLedgerRecordCreatedCommand` for `recordCreated` and `IProductLedgerRecordPublishedCommand`
for `recordPublished` share `outbound/types/commands/product-ledger.command.ts`. A use case keeps
one command file of its own, `<context>-<verb>.command.ts`.

**A config token is the module, the property and `_TOKEN`.** A token that carries a value read with
`ConfigValueProvider.provide` takes the prefix of its module, the name of the configuration property
it reads and the suffix `_TOKEN`: the product module reads `OCC_RETRY_ATTEMPTS` into
`PRODUCT_OCC_RETRY_ATTEMPTS_TOKEN`, the product-stock core module reads `ENQUEUE_RETRY_ATTEMPTS`
into `PRODUCT_STOCK_CORE_ENQUEUE_RETRY_ATTEMPTS_TOKEN` and the ledger core module reads the same
property into `LEDGER_CORE_ENQUEUE_RETRY_ATTEMPTS_TOKEN`. The token names where the value comes
from, not what the module does with it, so a reader finds the variable of `.env` by the name alone.
A module that reads one property for two purposes injects the one token in both places; a purpose
that needs a value of its own needs a property of its own, and with it a token of its own, so two
tokens never share a name. A property that already starts with the whole module name is not
repeated; one that shares only its first word is: `IDEMPOTENCY_KEY_TTL_HOURS` of the
`idempotency-purge` processor becomes `IDEMPOTENCY_PURGE_IDEMPOTENCY_KEY_TTL_HOURS_TOKEN`. The
suffix sets the token apart from the `_PORT` tokens in the same `outbound` barrel. The description
of the `Symbol` repeats the constant, and the file drops the suffix:
`order-redis-command-timeout-ms.token.ts`.

**A lib without layers names a type file by its role where the type has one.** Modules and layered
libs name an interface file by its role: `.command`, `.view`, `.options`. The types of
`libs/toolkit`, `libs/config`, `libs/auth` and `libs/contracts/src/database` serve a helper, a
provider or a guard rather than a use case. The options of a helper take `.options.ts`
(`replay-retry.options.ts`, `config-value-provide.options.ts`); a type with no such role keeps the
suffix of its syntax, `.interface.ts` or `.type.ts` (`hosted-repository.interface.ts`,
`utility.type.ts`).

**A helper method takes one options object and answers a noun.** The types of the method lie next to
the helper, as the options of every helper of `libs/toolkit` do: those of `PaginationHelper` in
`libs/toolkit/src/pagination`.

- One options interface per public method, and the argument is `options`:
  `clampPageWindow(options: IPageWindowClampOptions)`, `toPage<T>(options: IPageBuildOptions<T>)`.
- An options interface is `I<Subject><Action>Options` in `<subject>-<action>.options.ts`: what the
  method builds, then what it does to it. A method whose name is not a verb takes the verb of its
  work: `toPage` builds a page, `IPageBuildOptions`. Subject first keeps the files of one subject
  together.
- The parts of an options object are `I<Subject><Action><Part>` in the same file: the data the
  caller has in `query`, the optional defaults and caps in `limits`, as `IPageWindowClampQuery` and
  `IPageWindowClampLimits`. A caller then hands over its own object, `{ query: command }`. A part
  stays unexported until another file needs it; until then `IPageWindowClampOptions['query']`
  reaches it.
- The answer is the noun, `I<Subject>`, in `<subject>.interface.ts`: `IPageWindow`, `IPage<T>`. Two
  methods with the same answer share one.
- The answers leave the lib through its index, because callers keep and pass them on (`IPage<T>` in
  the views of the lists, `IPageWindow` in `CatalogProductListUseCase`). The options do not: callers
  pass literals.

A layered lib keeps `commands` and `views` for the input and output of a use case or a port: an
options interface is to a helper what a command is to a use case, its answer what a view is. A
domain keeps what a model takes in `types/data` and what it answers in `types/snapshots` (see
`038-domain-models.md`).
