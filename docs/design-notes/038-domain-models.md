# 038 — Domain models

A module with entities keeps its rules in its domain. The model checks a request, rebuilds the rows
it is stored in and answers every shape the use case hands on: the response, the rows to write, the
record of the ledger and the line of the log. The use case reads, writes and logs, and passes on
what the model answers.

## The use case maps nothing

**The model answers every shape that leaves the use case.**

| Shape                  | Method                                                    | Example                                         |
| ---------------------- | --------------------------------------------------------- | ----------------------------------------------- |
| the response           | `toSnapshot()`                                            | `ProductModel.toSnapshot()`                     |
| a row to insert        | `toInsertQuery()`, `get<Children>(id)` for its child rows | `RoleCandidateModel.getRolePermissions(roleId)` |
| a row to update        | `toUpdateQuery(versionAsRead)`                            | `NoteModel.toUpdateQuery(versionAsRead)`        |
| a record of the ledger | `to<UseCase>LedgerPayload()`                              | `ProductModel.toCreateLedgerPayload()`          |
| a line of the log      | `to<UseCase>LoggerPayload()`                              | `ReminderModel.toRescheduleLoggerPayload()`     |

The record of the ledger carries the subject, the payload and, where the model knows it, the time it
was created (`createdAt`); the adapter of the port adds the operation key, the type of the subject
and the action (see `022-enqueue-after-commit.md`).

**Without an instance, a static method answers.** A registration has only the issued id and the
candidate, so `AuthCustomerModel.toRegisterSnapshot(id, candidate)` picks the fields of the response
from them. A static method that would only wrap its arguments in an object is not written: the use
case logs the literal (see below).

**One model answers each of its use cases with a method of its own.** `ProductModel` serves the
creation, the update and the publication, so it has `toCreateLoggerPayload`, `toUpdateLoggerPayload`
and `toPublishLoggerPayload`. A model is split per use case only when the use cases need different
state (see Aggregates below).

**A line of the log names the fields of the entity.** `{ id, sku }`, not `{ productId, sku }`, and
`{ subjectType, subjectId, subjectTags: [{ tagId }] }` for the tags of a subject. A value derived
from others stays out (`units`, `onHand`, `nameAsRead`): the message carries the outcome, as
`Ledger record already appended` does.

**Two values of one type travel in a params object.** Positional strings swap without an error, so
`IdempotencyCoreKeyModel.toKeyLoggerPayload({ scope, key })` and
`NoteModel.toRevisionInsertQuery({ bodyBefore, editorId, correlationId })` take one object, named as
the params of a helper (see `029-naming.md`): `IIdempotencyCoreKeyLoggerPayloadBuild`.

**What stays in the use case.**

- A command of a port made of the values of the request: `{ productId, expectedVersion }`, the body
  of an idempotency claim.
- A line of the log made of the values at hand only: `{ idempotencyKey }` of a replay,
  `{ id, version }` of a lost optimistic race, `{ id }` of a registration.
- The outcome of the application: `{ outcome, tags, missingTagIds }`, and the answer of another
  module passed on as is, `{ tags }`.
- A choice of the application the domain cannot see: the signs of the kinds of a stock movement come
  from the contracts of `core/modules/src/product-stock`, which its domain may not import, so the
  use case hands the sign to `ProductStockCoreMovementsModel.create({ sign, movements })`.
- A use case without an entity keeps its literals: the ticks and the failure reports of the
  processor, the administration of the queues, the enqueue of the core ledger, a failed login and
  the libs.

## Domain interfaces

The interfaces of a domain lie in two folders, by the side of the model or the event they are on.
They follow the params and snapshots of a helper (see `029-naming.md`): a method of a model takes
one params object, and every shape a model or an event answers is a snapshot.

| Folder                         | Name                                         | What it is                                                                                                                                                                                                                                             |
| ------------------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `domain/interfaces/params/`    | `I<Model>Reconstitute`                       | the row a model is rebuilt from, `Model.reconstitute(record)`                                                                                                                                                                                          |
|                                | `I<Model>CandidateInit`                      | the data a new row is checked against, `Model.initCandidate(proposal)`                                                                                                                                                                                 |
|                                | `I<Model><Action>`                           | the edits an operation takes, `IProductUpdate` for `ProductModel.update(changes)`                                                                                                                                                                      |
|                                | `I<Model>Create`                             | the request a candidate model is created from, `OrderCandidateModel.create(proposal)`                                                                                                                                                                  |
|                                | `I<Model><Answer>Build`                      | the values a `to…` method builds its answer from, `INoteRevisionInsertQueryBuild`                                                                                                                                                                      |
| `domain/interfaces/snapshots/` | `I<Model>Candidate`                          | the row `initCandidate` answers for an insert                                                                                                                                                                                                          |
|                                | `I<Model>Snapshot`                           | the state a model answers with `toSnapshot()`                                                                                                                                                                                                          |
|                                | `I<Model>InsertQuery`, `I<Model>UpdateQuery` | the row to write, `IRoleCandidateInsertQuery`, `INoteUpdateQuery`                                                                                                                                                                                      |
|                                | `I<Model><UseCase>LedgerPayload`             | the record of the ledger, `IProductCreateLedgerPayload`                                                                                                                                                                                                |
|                                | `I<Model><UseCase>LoggerPayload`             | the line of the log, `IProductUpdateLoggerPayload`                                                                                                                                                                                                     |
|                                | `I<Subject>`                                 | another answer, by its noun: `ITagCommonSubjectTagsChanges` from `TagCommonSubjectTagsModel.replace`, `IOrderProductStockMovement` from `OrderPlaceModel.getProductStockMovements`, `IProductLedgerRecord` from `ProductPublishedEvent.toLedgerRecord` |

The folder names the role, so the file repeats the name without `I` and ends with `.interface.ts`:
`order-reconstitute.interface.ts` holds `IOrderReconstitute`, `product-candidate.interface.ts` holds
`IProductCandidate`. The argument takes the name of what it holds: `record`, `proposal`, `changes`.

A part of a params object is `I<Params><Part>`, unexported in the file of its params until another
file names it: `IProductStockCoreOnHandReconstituteStockSum` is the element of `stockSums` in
`IProductStockCoreOnHandReconstitute`. A part of a snapshot is the snapshot of its noun:
`IOrderProductSnapshot` is an element of `IOrderSnapshot`.

## Candidates

**A candidate of one row is a snapshot.** `initCandidate` checks a new row in one call and answers
it as the row to insert: `ProductModel.initCandidate(proposal)` answers `IProductCandidate`, and the
use case inserts it as is.

**A candidate written to several tables, or checked in steps, is a model of its own.**
`<Model>CandidateModel.create(proposal)` holds the request; `toInsertQuery()` answers the main row,
`get<Children>(id)` the child rows under the issued id, `assert…` checks what the use case read, and
`toSnapshot(id)` answers the created row without reading it back. `RoleCandidateModel` writes
`staff_role` and `staff_role_permissions`, `UserStaffUserCandidateModel` writes `staff_user` and
`staff_user_roles`. A candidate of one row answers the same way with a static method of its model,
`AuthCustomerModel.toRegisterSnapshot(id, candidate)`.

An order is checked against rows the use case reads only after a lock (see
`021-pessimistic-locking.md`), so `OrderCandidateModel` checks in steps: `validate()` refuses an
empty request before any read, `distinctProductIds` names the rows to lock and read,
`assertProducts` and `assertStockQuantities` check what was read, `toInsertQuery()` and
`getOrderProducts(orderId)` answer the rows to insert. Each check takes its own params,
`IOrderCandidateActiveProduct` and `IOrderCandidateStockQuantity`.

## Read models

A read answers what a model makes of the record, never the record mapped in the application layer:
for one row the use case calls `Model.reconstitute(record)` and answers `toSnapshot()`. A page has a
model of its own, `<Context>GetManyModel`, whose static `toViewData(records)` rebuilds every row and
answers the snapshots (`TagGetManyModel`): the domain defines the listed item, and the use case only
puts the snapshots on the page. A module that only reads has a domain for that alone:
`LedgerListEntriesModel` in `apps/staff-app/src/features/ledger`, `ProductStockCoreOnHandModel` in
`core/modules/src/product-stock`.

**A read model is a plain class unless it is a model of an aggregate.** A model with the columns of
its own read records no events and takes no changes, so it does not extend `AggregateRootBase`, like
`StaffAuthCoreSubjectModel`.

**A list model carries the columns of the list.** A page of orders carries no products, so
`OrderGetManyModel` rebuilds it, not `OrderGetOneModel`, whose record requires them. Both live in
the domain of the order, the list model with `order-get-many-reconstitute.interface.ts` and
`order-get-many-snapshot.interface.ts`. Its `toSnapshot` is private: only `toViewData` calls it. A
list model does not repeat the checks of the aggregate: it rebuilds what the aggregate stored.

**A model may be rebuilt from several rows.** `ProductStockCoreOnHandModel.reconstitute` takes the
products and the sums of their stock rows as one record and answers the stock of every product in
the order of the products, zero for a product without rows.

## Aggregates

**An aggregate shared by use cases that need different state has a model per use case.** The
aggregate is an abstract class in `domain/aggregates/<context>.aggregate.ts` that holds the state
every use case reads and answers `toSnapshot()`: `OrderAggregate`. Each use case extends it with a
model of its own, which adds only the state and the answers that use case needs: `OrderPlaceModel`
adds the owner, the stock movements and the payloads of the ledger and the log, and
`OrderGetOneModel` adds nothing. The aggregate extends `AggregateRootBase`, so a model of a use case
that only reads extends it too.
