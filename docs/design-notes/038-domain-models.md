# 038 — Domain models

A module with entities keeps its rules in its domain. The model checks a request, rebuilds the rows
it is stored in and answers every shape the use case hands on: the response, the rows to write, the
record of the ledger and the line of the log. The use case reads, writes and logs, and passes on
what the model answers.

## The use case maps nothing

**The model answers every shape that leaves the use case.**

| Shape                  | Method                                                         | Example                                            |
| ---------------------- | -------------------------------------------------------------- | -------------------------------------------------- |
| the response           | `toSnapshot()`                                                 | `ProductGetOneModel.toSnapshot()`                  |
| a row to insert        | `toInsertPayload()`, `create<Children>(id)` for its child rows | `RoleCandidateModel.createRolePermissions(roleId)` |
| a row to update        | `toUpdatePayload(versionAsRead)`                               | `NoteEditModel.toUpdatePayload(versionAsRead)`     |
| a record of the ledger | `toLedgerPayload()`                                            | `ProductCreateModel.toLedgerPayload()`             |
| a line of the log      | `toLoggerPayload()`                                            | `NoteResolveModel.toLoggerPayload()`               |

The record of the ledger carries the subject, the payload and the time of the change as the database
stored it; the adapter of the port adds the operation key, the type of the subject and the action
(see `022-enqueue-after-commit.md`). A row that was inserted gives its `createdAt`: product and
order read it back, and the registration and a restock take it from the insert: `insertReturning` of
the hosted repository answers the `createdAt` that TypeORM reads back into `generatedMaps` (see
`034-orm-lib.md`; `AuthRegisterRepository.insert`, core `ProductStockCoreMoveRepository.insertMany`,
whose rows core `handleMove` answers). A row that was updated gives its `updatedAt` from a read
after the update: the product write service reads the product again, and the core archive reads it
with `findById`. No adapter stamps the time itself.

**Without an instance, a static method answers.** An idempotency key has only its scope and key, so
`IdempotencyCoreReleaseModel.toLoggerPayload({ scope, key })` names the fields of the log line. A
static method that would only wrap its arguments in an object is not written: the use case logs the
literal (see below).

**Every use case has a model of its own.** A model takes the use case into its name and answers with
plain names: `ProductCreateModel`, `ProductUpdateModel` and `ProductPublishModel`, each with
`toLoggerPayload()`, not one `ProductModel` with `toCreateLoggerPayload` and
`toUpdateLoggerPayload`. The state and the rules the models share live in an aggregate (see
Aggregates below).

**A name does not repeat its class.** The class already names the context and the use case, so the
method names only what it answers: `AuthCustomerLoginModel.toLoggerPayload()`,
`TagCommonSubjectTagsReplaceModel.toSnapshots`, `ProductStockCoreMovementsModel.toRows`. A child
entity keeps its name, `createOrderProducts`. A model in another context takes it in front:
`StaffAuthCommonSubjectModel`, `ProductCoreArchiveModel`, `ProductStockAddModel`.

**A line of the log names the fields of the entity.** `{ id, sku }`, not `{ productId, sku }`, and
`{ subjectType, subjectId, subjectTags: [{ tagId }] }` for the tags of a subject. A value derived
from others stays out (`units`, `onHand`, `nameAsRead`): the message carries the outcome, as
`Ledger record already appended` does.

**Two values of one type travel in a params object.** Positional strings swap without an error, so
`IdempotencyCoreReleaseModel.toLoggerPayload({ scope, key })` and
`NoteEditModel.toRevisionInsertPayload({ bodyBefore, editorId, correlationId })` take one object,
named as the params of a helper (see `029-naming.md`): `IIdempotencyCoreReleaseLoggerPayloadBuild`.

**What stays in the use case.**

- A command of a port made of the values of the request: `{ productId, expectedVersion }`, the body
  of an idempotency claim.
- A line of the log made of the values at hand only: `{ idempotencyKey }` of a replay,
  `{ id, version }` of a lost optimistic race.
- The outcome of the application: `{ outcome, tags, missingTagIds }`, and the answer of another
  module passed on as is, `{ tags }`.
- A choice of the application the domain cannot see: the signs of the kinds of a stock movement come
  from the contracts of `core/modules/src/product-stock`, which its domain may not import, so the
  use case hands the sign to `ProductStockCoreMovementsModel.create({ sign, movements })`.
- A use case without an entity keeps its literals: the ticks and the failure reports of the
  processor, the administration of the queues, the enqueue of the core ledger, a failed login and
  the libs.

## Domain interfaces

The interfaces of a domain lie in two folders, by the side of the model they are on. They follow the
params and snapshots of a helper (see `029-naming.md`): a method of a model takes one params object,
and every shape a model answers is a snapshot.

| Folder                         | Name                                             | What it is                                                                                                                                                                                       |
| ------------------------------ | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `domain/interfaces/params/`    | `I<Model>Reconstitute`                           | the row a model is rebuilt from, `Model.reconstitute(record)`                                                                                                                                    |
|                                | `I<Model>CandidateInit`                          | the data a new row is checked against, `Model.initCandidate(proposal)`                                                                                                                           |
|                                | `I<Model><Action>`                               | the edits an operation takes, `IProductUpdate` for `ProductUpdateModel.update(changes)`                                                                                                          |
|                                | `I<Model>Create`                                 | the request a candidate model is created from, `OrderCandidateModel.create(proposal)`                                                                                                            |
|                                | `I<Model><Answer>Build`                          | the values a `to…` method builds its answer from, `INoteEditRevisionInsertPayloadBuild`                                                                                                          |
| `domain/interfaces/snapshots/` | `I<Model>Candidate`                              | the row `initCandidate` answers for an insert                                                                                                                                                    |
|                                | `I<Model>Snapshot`                               | the state a model answers with `toSnapshot()`                                                                                                                                                    |
|                                | `I<Model>InsertPayload`, `I<Model>UpdatePayload` | the row to write, `IRoleCandidateInsertPayload`, `INoteUpdatePayload`; `Query` stays the kind of an outbound interface                                                                           |
|                                | `I<Model><UseCase>LedgerPayload`                 | the record of the ledger, `IProductCreateLedgerPayload`                                                                                                                                          |
|                                | `I<Model><UseCase>LoggerPayload`                 | the line of the log, `IProductUpdateLoggerPayload`                                                                                                                                               |
|                                | `I<Subject>`                                     | another answer, by its noun: `ITagCommonSubjectTagsReplaceChanges` from `TagCommonSubjectTagsReplaceModel.replace`, `IOrderProductStockMovement` from `OrderPlaceModel.getProductStockMovements` |

The folder names the role, so the file repeats the name without `I` and ends with `.interface.ts`:
`order-reconstitute.interface.ts` holds `IOrderReconstitute`,
`product-create-candidate.interface.ts` holds `IProductCreateCandidate`. The argument takes the name
of what it holds: `record`, `proposal`, `changes`.

`<Model>` is the model that answers: an interface of one use case takes its model's name,
`IProductCreateCandidate`, `IRoleReassignPermissionsLoggerPayload`, and an interface every model of
an aggregate reads keeps the name of the aggregate, `IProductReconstitute`, `IProductSnapshot`,
`IProductUpdatePayload`.

A part of a params object is `I<Params><Part>`, unexported in the file of its params until another
file names it: `IProductStockCoreOnHandReconstituteStockSum` is the element of `stockSums` in
`IProductStockCoreOnHandReconstitute`. A part of a snapshot is the snapshot of its noun:
`IOrderProductSnapshot` is an element of `IOrderSnapshot`.

## Candidates

**A candidate of one row is a snapshot.** `initCandidate` checks a new row in one call and answers
it as the row to insert: `ProductCreateModel.initCandidate(proposal)` answers
`IProductCreateCandidate`, and the use case inserts it as is.

**A candidate written to several tables, checked in steps, or answered without reading it back is a
model of its own.** `<Model>CandidateModel.create(proposal)` only holds the request, and the use
case calls the checks in order, so the order is read in one place: `validate()` and `assert…` refuse
a request, `assertEmail()` checks the email the candidate holds as a value object.
`toInsertPayload()` answers the main row and `create<Children>(id)` the child rows under the issued
id: `RoleCandidateModel` writes `staff_role` and `staff_role_permissions`,
`UserStaffUserCandidateModel` writes `staff_user` and `staff_user_roles`. The answer comes without
reading the row back: the candidate hands its stored row, and a model of the use case rebuilt from
it answers the response, the record of the ledger and the line of the log, as `OrderPlaceModel` does
from the record it reads after the insert. `AuthCustomerCandidateModel.toRegistered(id)` answers
`IAuthCustomerRegisterReconstitute` for `AuthCustomerRegisterModel`,
`UserStaffUserCandidateModel.toRegistered(id)` feeds `UserStaffUserRegisterModel`, and
`RoleCandidateModel.toCreated(id)` feeds `RoleCreateModel`.

An order is checked against rows the use case reads only after a lock (see
`021-pessimistic-locking.md`), so `OrderCandidateModel` checks in steps: `validate()` refuses an
empty request before any read, `distinctProductIds` names the rows to lock and read, counted once in
`create` and handed `readonly` to the lock of core and the read, `assertProducts` and
`assertStockQuantities` check what was read, `toInsertPayload()` and `createOrderProducts(orderId)`
answer the rows to insert. Each check takes its own params, `IOrderCandidateActiveProduct` and
`IOrderCandidateStockQuantity`.

## Read models

A read answers what a model makes of the record, never the record mapped in the application layer:
for one row the use case calls `Model.reconstitute(record)` and answers `toSnapshot()`. A page has a
model of its own, `<Context>GetManyModel`, whose static `toViewData(records)` rebuilds every row and
answers the snapshots (`TagGetManyModel`): the domain defines the listed item, and the use case only
puts the snapshots on the page. A module that only reads has a domain for that alone:
`LedgerListEntriesModel` in `apps/staff-app/src/features/ledger`, `CatalogProductListModel` in
`apps/customer-app/src/features/catalog`, `ProductStockCoreOnHandModel` in
`core/modules/src/product-stock`.

**A read model is a plain class unless it is a model of an aggregate.** A model with the columns of
its own read takes no changes and keeps no identity, so it does not extend `Entity` of
`libs/domain`, like `StaffAuthCommonSubjectModel`.

**A list model carries the columns of the list.** A page of orders carries no products, so
`OrderGetManyModel` rebuilds it, not `OrderGetOneModel`, whose record requires them. Both live in
the domain of the order, the list model with `order-get-many-reconstitute.interface.ts` and
`order-get-many-snapshot.interface.ts`. Only `toViewData` is public: the fields, `reconstitute` and
`toSnapshot` are private, as nothing else calls them. A list model does not repeat the checks of the
aggregate: it rebuilds what the aggregate stored.

**A model may be rebuilt from several rows.** `ProductStockCoreOnHandModel.reconstitute` takes the
products and the sums of their stock rows as one record and answers the stock of every product in
the order of the products, zero for a product without rows.

## Aggregates

**The models of the use cases of one entity share an aggregate.** The aggregate is an abstract class
in `domain/aggregates/<context>.aggregate.ts` that holds the state every use case reads, the checks
of its fields and the answers they share, `toSnapshot()` and `toUpdatePayload(versionAsRead)`:
`OrderAggregate`, `RoleAggregate`, `ProductAggregate`, `NoteAggregate`, `TagAggregate`. An aggregate
of many columns takes the record whole and checks it in its constructor, so a model of a use case
rebuilds itself with `new <Model>(record)`. Each use case extends it with a model of its own, which
adds only the state and the answers that use case needs: `OrderPlaceModel` adds the owner, the stock
movements and the payloads of the ledger and the log, and `OrderGetOneModel` adds nothing. The
aggregate extends `Entity` of `libs/domain`, so a model of a use case that only reads extends it
too. No model records domain events: a change reaches the ledger through `toLedgerPayload()`, as
every other shape that leaves the use case. Neither `Entity` nor `ValueObject` compares two
instances: no model compares two of them, and a use case compares the ids or the fields it means.

**A versioned aggregate extends `VersionedEntity`.** `ProductAggregate`, `NoteAggregate` and the
core `ProductCoreArchiveModel` take their `version` from `VersionedEntity` of `libs/domain`: the
public `version`, `bumpVersion()` for a change, `isExpectedVersion(expectedVersion)` for `If-Match`
and the static `isValidVersion(version)`. The base throws nothing, so an aggregate checks the stored
version with `isValidVersion` and refuses with an exception of its module,
`ProductVersionInvalidException`, and `assertExpectedVersion` of `ProductAggregate` and
`NoteAggregate` refuses a stale `If-Match` with `ProductVersionMismatchException` or
`NoteVersionMismatchException`; the core module answers the mismatch as an outcome.

**A shared service takes the model of the caller.** The access and write services of an entity serve
several use cases, so the caller passes the static `reconstitute` of its model and gets that model
back: `accessService.load({ tagId }, TagRenameModel.reconstitute)`,
`writeService.write(command, ProductPublishModel.reconstitute, (product) => product.publish())`.
`reconstitute` declares `this: void`, as it names its class rather than `this`, and the write
service bounds the model by the aggregate, whose `version` and `toUpdatePayload` it needs. A use
case that only checks the entity exists asks for no model: `NoteAccessService.assertOwned`,
`ProductAccessService.assertExists`. The write service hands back what `mutate` answers next to the
stored model: `ProductPublishModel.publish()` answers the status the product left, and the stored
model answers `toLedgerPayload(previousStatus)` with its new version and `updatedAt`;
`NoteEditModel.edit(body)` answers whether the body changed, and the model remembers the body it was
read with for `toRevisionInsertPayload` (see `007-optimistic-concurrency.md`).

**Use cases that share no state have models without an aggregate.** The login reads the hash and the
status of a customer, the registration answers its id and email, so `AuthCustomerLoginModel` and
`AuthCustomerRegisterModel` stand alone.

**A value with one rule for every module is a value object of `core/domain`.** `EmailValue` of
`@acme-core/domain` extends `ValueObject` of `libs/domain`: `EmailValue.create(email)` trims the
email and lowers its case, so no email exists unnormalized, and `isValid()` answers whether its form
holds. It answers a boolean, not an exception, as core refuses in no module's words (see
`027-core-module-outcomes.md`): a candidate holds it and refuses with an exception of its own
module, `AuthCustomerCandidateModel.assertEmail()` with `AuthEmailInvalidException` and
`UserStaffUserCandidateModel.assertEmail()` with `UserEmailInvalidException`. The domain checks the
form only where it writes an email; a login only builds the value before the read,
`repository.findByEmail(customerEmail.address)`, as a malformed email finds no user and answers what
an unknown email answers. The domain and the application of a feature, a processor, a common or a
core module may import the core domain; the other layers may not.

**A value with a rule of one module is a value object of that module.** It lives in
`domain/values/<context>-<value>.value.ts` and extends `ValueObject` the same way:
`LedgerInstantValue` of the processor ledger answers `hasExplicitZone()`, `isValid()` and
`toDate()`, and `LedgerAppendEntryModel.initCandidate` refuses with `LedgerInstantInvalidException`.
A value object answers booleans and leaves the refusal to the model, so its checks read as steps.

## Access

**A member is as open as its readers.** A field or a method that only its class reads is private:
the fields of a list model, the fields of `AuthCustomerRegisterModel` that only its answers read. A
field the use case decides on stays public, as `AuthCustomerLoginModel.passwordHash` for the check
of the password. An id that an error only puts in its message is a plain parameter of the
constructor, not a field. The getters of the repositories in a persistence host stay protected for
the repositories that extend it (see `034-orm-lib.md`).

**A field behind a getter takes the name of the getter with `_`.** A getter lets others read a field
that only its class changes, and a field cannot share its name with an accessor, so the field takes
the name of its getter with a leading `_`: `Entity._id` behind `id`, `VersionedEntity._version`
behind `version`, `ProductCoreArchiveModel._status` behind `status`,
`OrderCandidateModel._distinctProductIds` behind `distinctProductIds`. `TagAggregate` holds `_name`
because `TagRenameModel` reads it through `get name()`, and a subclass cannot turn a field of its
base into an accessor. A field without a getter keeps the plain name, as `name` and `status` of
`ProductAggregate` and `body` and `resolved` of `NoteAggregate`.
