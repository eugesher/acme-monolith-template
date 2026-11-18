# 007 — Optimistic concurrency

A row with a `version` column is changed through a write service that retries a lost race.

| Part              | Example                                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------- |
| write service     | `apps/staff-app/src/features/catalog/modules/product/application/services/product-write.service.ts`                       |
| conflict error    | `apps/staff-app/src/features/catalog/modules/product/application/errors/product-write-conflict.error.ts`                  |
| repository update | `apps/staff-app/src/features/catalog/modules/product/infrastructure/persistence/repositories/product-write.repository.ts` |
| retry helper      | `OccRetryHelper` in `libs/toolkit/src/concurrency/occ-retry.helper.ts`                                                    |
| `If-Match`        | `apps/staff-app/src/common/shared/concurrency/decorators/if-match.decorator.ts`                                           |

The same pattern serves `ReminderWriteService` and `NoteWriteService` in
`apps/staff-app/src/features/tools/modules`.

## One attempt

`ProductWriteService.write(command, mutate)` is the only way to change a stored row. Every attempt:

1. loads the aggregate fresh through the access service;
2. checks the `If-Match` version with `product.assertExpectedVersion(expectedVersion)`;
3. applies `mutate` in memory;
4. saves with `UPDATE … WHERE id = ? AND version = <as read>`.

**A change to the current values changes nothing.** The model keeps the version, so the service does
not touch the database, and a repeated request does not invalidate the `If-Match` version of
everyone else.

**The repository answers a lost race with `false`, not an error.** The service reads the current
version and throws its own conflict error, which only `OccRetryHelper` sees. Because the class is
local to the module, the retry loop cannot swallow another module's conflict.

**The budget comes from config** (`OCC_RETRY_ATTEMPTS` into a token of the module). A pinned
`If-Match` collapses it to one attempt: retrying against a newer version would apply a change the
client never saw. A spent budget is `VERSION_MISMATCH` (409) with `details.currentVersion`. A domain
refusal is never retried.

After a successful save the service reads the row again, so the answer carries the new `updatedAt`.

**There is no global filter for TypeORM's `OptimisticLockVersionMismatchError`.** TypeORM throws it
only for a read with an optimistic lock, and nothing reads that way: the version check is the
`WHERE` of the update.

## `If-Match` is a version

`3` and `"3"` both mean version 3; a missing or empty header means "no expectation". Anything that
is not a non-negative integer, including a weak tag `W/"3"`, is refused with `IF_MATCH_INVALID`
(400), so a typo cannot turn into an unconditional write. The decorator lives in `common/shared`,
because only staff features read the header.

## The change answers the ledger

`mutate` may answer a value, and the service hands it back next to the stored model,
`{ product, answer }`. The service reads the row again after the save, so a fact that only the
changed model knows reaches the use case through the answer: `ProductPublishModel.publish()` answers
the status the product left, or nothing for a product that was already active. The stored model
answers the record, `product.toLedgerPayload(previousStatus)`, with its new version and the
`updatedAt` the database gave the update, and the use case records nothing when the answer is empty.
`IProductLedgerPort.recordPublished` adds the operation key and the action and enqueues the record
on the `ledger-record` queue (see `022-enqueue-after-commit.md` and `004-append-only-journal.md`).
The models record no domain events: each fact has one reader, the ledger, and the use case calls it
directly.

## `PATCH` edits fields, `PUT` sets a state

`PATCH /catalog/products/:productId` takes the fields to change, every one optional
(`apps/staff-app/src/features/catalog/modules/product/presentation/dto/requests/product-update.request.dto.ts`).
A state change has no body: `PUT` on the state resource (`.../publish`, `.../archive`) says what the
row becomes.
