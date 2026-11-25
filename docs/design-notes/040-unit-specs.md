# 040 — Unit specs

A unit spec checks one class through its public members. Its collaborators are typed mocks, its
fixtures are written out in each test, and what it asserts is what a caller of the class relies on.
`001-tests-and-tooling.md` covers the architecture specs of `spec/`, and `015-quality-gates.md` the
coverage thresholds and the lint of tests.

| Part                      | Example                                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| use case in a transaction | `apps/staff-app/src/features/warehouse/modules/product-stock/application/use-cases/spec/product-stock-add.use-case.spec.ts` |
| model                     | `apps/staff-app/src/features/tools/modules/tag/domain/models/spec/tag-update.model.spec.ts`                                 |
| processor                 | `apps/processor-app/src/processors/ledger-append/shell/spec/ledger-append.processor.spec.ts`                                |
| request DTO               | `apps/staff-app/src/features/tools/modules/tag/presentation/dto/requests/spec/tag-update.request.dto.spec.ts`               |
| query builder             | `apps/staff-app/src/features/tools/modules/tag/infrastructure/persistence/builders/spec/tag-persistence.builder.spec.ts`    |
| module                    | `libs/cache/src/shell/spec/cache.module.spec.ts`                                                                            |
| logger mock               | `libs/testing/src/observability/pino-logger.mock.ts`                                                                        |

## What gets a spec

**A spec lives next to its subject**, in `spec/<subject>.spec.ts` of the subject's folder, and
imports the subject from `../`. It tests through the public members; a private member is reached
through the public one that calls it. No member is public for a test: neither a spec nor the e2e
context reaches a part of a class that production code does not call, so what they check is the path
the app takes (see `014-e2e-suites.md`).

**Every file the coverage counts gets one**, because the threshold is 100% per file. A request,
query or param DTO that declares validation of its own and the module in `shell/` of a lib get one
too, though the coverage cannot see them: `spec/required-specs.spec.ts` asks for them (see
`015-quality-gates.md`). What the coverage excludes needs none: barrels, declarations, the modules
of an app, repositories, persistence hosts, controllers and facades are wiring or SQL, and the e2e
suites run them.

**A controller and a facade get no spec.** Each method of either reads its input and hands one
command to a use case, so a spec of it would repeat the spec of the use case. What a controller
adds, the route, its guard and the DTOs it validates with, lives in decorators that a unit spec does
not read and that the tables of the e2e suites check (see `014-e2e-suites.md`); a dropped `await` is
caught by `return-await`, a missing field of the command by the typecheck.
`spec/required-specs.spec.ts` refuses a spec of a controller or a facade, and
`spec/e2e-endpoints.spec.ts` asks for a case of every route handler instead.

## The shape of a spec

**The root `describe` is named after the class**, with a nested `describe` per public method when
there are several. A title says what the class does in the words of its domain:
`refuses a resolved note with NOTE_RESOLVED`, `answers the stored tag`,
`lets a failed lock reject before it writes`. The first column of an `it.each` table describes the
case and fills the `%s` of the title; its parameter is `_case`.

**Fixtures are literals in the test.** Every test writes out the records, views and payloads it
needs, even when the next test repeats them, so a test reads from top to bottom and a change to one
cannot shift another. A spec holds no shared constants and no fixture builders; a helper the whole
suite needs sits in the root `describe`, and one many specs need lives in `libs/testing`, as the
logger mock and `E2EContext` do.

**`beforeEach` builds the mocks and the subject again for every test.** `restoreMocks` of the unit
config puts back every `jest.spyOn` before each test, so no spec restores spies by hand. `afterEach`
resets only what a mock is not: `process.env`, `PinoLogger.root`, a Nest context, the fake timers of
a test that turned them on.

## Mocks

| Collaborator                                                                         | Mock                                                                                     |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| a port, or any interface                                                             | `jest.Mocked<IProductLedgerPort>`: an object with a `jest.fn()` per method, passed as is |
| a class of the template (a service, a use case)                                      | `jest.Mocked<Pick<ProductWriteService, 'write'>>`, passed with one `as unknown as`       |
| a port of an inner use case built by a shell spec                                    | `jest.Mocked<ConstructorParameters<typeof CatalogProductListUseCase>[0]>`                |
| the logger                                                                           | `makePinoLoggerMock()` of `libs/testing`, passed as is                                   |
| a driver or a framework object (Redis, a BullMQ queue, a span, an execution context) | a partial fake with a cast                                                               |

**A mock is configured through its typed member**: `repository.findOne.mockResolvedValue(record)`.
The type of the port checks the fixture there, so a view that lost a field or an enum value written
as a string fails `yarn typecheck`. A chained `jest.fn().mockResolvedValue(record)` is a `Mock<any>`
and checks nothing; it stays for a callback handed to the subject, such as the work of a
transaction. An implementation that records calls goes through `mockImplementation(…)` of the typed
member as well.

**A class takes a cast because its private members make it nominal**: no object literal satisfies
it, so the spec types the methods it mocks with `Pick` and casts once where it hands the mock over.
A processor spec that builds a real use case may not import the `outbound` of its module, so it
takes the type of the port from the constructor of the use case.

**A fake of a driver stays partial.** Its shape belongs to the library, and the e2e suites check it
against the real Redis, MySQL and BullMQ; a full mock of `Redis` would repeat its typings and still
not prove the runtime.

**An assertion reads the member where it lives**:
`expect(repository.update).toHaveBeenCalledWith(…)`. `jest/unbound-method` lets a method into
`expect` and still flags a method taken off its object.

## What a spec asserts

**The answer and every call to a collaborator, with its arguments.** An enum in a fixture is its
member, the wire value in an expectation is the literal: the expectation reads as the body or the
row it pins. When the subject logs, the spec asserts the payload and the message of the line.

**The order of calls around a transaction** is one journal that the fake `run` and every mock write
into, asserted whole (see `026-transaction-port.md`).

**An error of the domain by its code and its message**, the two things the client receives:
`rejects.toMatchObject({ code, message })`, or
`toThrow(expect.objectContaining({ code, message }) as Error)` for a synchronous call. The title
names the code, not the class. A Nest `HttpException` keeps its class check, which fixes the status,
next to a check of its `response`.

**A failure of a collaborator reaches the caller.** A case that makes a port reject,
`lets a failed write reject`, keeps an `await` from turning into a `void` that would answer success.
A `void` method is asserted with `await expect(call).resolves.toBeUndefined()` (see
`015-quality-gates.md`).

**A query builder is asserted by its SQL**, `getQueryAndParameters()` of the builder the method
returns, as a repository chains it. The repositories are excluded from the coverage, so this is the
one unit check of the SQL. The `DataSource` of the spec spies the `connect` of its driver in
`beforeAll` and reaches no database.

**A module spec boots its module in Nest**, an application when the module serves HTTP and an
application context otherwise, with stubs of what the module reads, such as `ConfigService`. It
checks wiring the e2e suites cannot see in isolation, such as the options of a Redis client or the
order of the shutdown hooks, and closes what it booted when the case ends. Every module in `shell/`
of a lib has one, since a lib configures a driver or a client with options no e2e case reads:
`orm.module.spec.ts` replaces `connect` of the MySQL driver on its prototype, taken from a probe
`DataSource` because TypeORM does not export the driver class, and checks the options of
`DATABASE_*` and the snake_case names of a registered entity.

## A guarantee is proven once by breaking it

A spec that pins a rule of a note, such as the transaction boundary, the completion of an
idempotency key or the order of the shutdown, is checked once by a mutation: break the code, watch
the spec fail, put the code back. The mutant must type-check; ts-jest fails the whole file on a type
error, which proves nothing about the spec. Moving `idempotency.complete` after the commit, locking
before the transaction begins and starting the work before `run` are the mutants of the transaction
specs.
