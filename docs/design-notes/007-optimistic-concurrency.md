# 007 — Optimistic concurrency

A row with a `version` column is changed through a write service that retries a lost race.

| Part              | Example                                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------- |
| write service     | `apps/staff-app/src/features/catalog/modules/product/application/services/product-write.service.ts`                       |
| conflict error    | `apps/staff-app/src/features/catalog/modules/product/application/errors/product-write-conflict.error.ts`                  |
| repository update | `apps/staff-app/src/features/catalog/modules/product/infrastructure/persistence/repositories/product-write.repository.ts` |
| retry helper      | `OccRetryHelper` in `libs/toolkit/src/concurrency/occ-retry.helper.ts`                                                    |
| `If-Match`        | `libs/http/src/concurrency/decorators/if-match.decorator.ts`                                                              |

`NoteWriteService` in `apps/staff-app/src/features/tools/modules/note` has the same shape.

## One attempt

`ProductWriteService.write(command, reconstitute, mutate)` is the only way to change a stored row.
Every attempt:

1. loads the aggregate fresh through the access service;
2. checks the `If-Match` version with `product.assertExpectedVersion(expectedVersion)`;
3. applies `mutate` in memory;
4. saves with `UPDATE … WHERE id = ? AND version = <as read>`.

**The note takes the save from the use case.**
`NoteWriteService.write(command, reconstitute, mutate, save)` runs the same attempt, and
`save({ note, versionAsRead })` answers whether the row was updated: the resolve updates one row,
the update writes the note and appends its revision in one transaction (see
`011-multi-table-transaction.md`). A product is always saved by one update, so its write service
makes it itself.

**A change to the current values changes nothing.** The model keeps the version, so the service does
not touch the database, and a repeated request does not invalidate the `If-Match` version of
everyone else.

**The repository answers a lost race with `false`, not an error.** The service reads the current
version and throws its own conflict error, which only `OccRetryHelper` sees. Because the class is
local to the module, the retry loop cannot swallow another module's conflict.

**The budget comes from config** (`OCC_RETRY_ATTEMPTS` into a token of the module). A pinned
`If-Match` collapses it to one attempt: retrying against a newer version would apply a change the
client never saw. A domain refusal is never retried.

| Refusal                                                   | Code               | Status |
| --------------------------------------------------------- | ------------------ | ------ |
| a stale `If-Match`                                        | `VERSION_MISMATCH` | 412    |
| a race lost at the one attempt of a pinned `If-Match`     | `VERSION_MISMATCH` | 412    |
| a race lost at every attempt of the budget, no `If-Match` | `VERSION_CONFLICT` | 409    |

Both carry `details.currentVersion`. A failed `If-Match` is a failed precondition: the client sends
the request again only after it has read the new version. A spent budget is a conflict: the same
request may succeed later.

After a successful save the service reads the row again, so the answer carries the new `updatedAt`.

**There is no global filter for TypeORM's `OptimisticLockVersionMismatchError`.** TypeORM throws it
only for a read with an optimistic lock, and nothing reads that way: the version check is the
`WHERE` of the update.

## `If-Match` is a version

`3` and `"3"` both mean version 3; a missing or empty header means "no expectation". Anything but
decimal digits, bare or quoted, is refused with `IF_MATCH_INVALID` (400), so a typo cannot turn into
an unconditional write: a weak tag `W/"3"`, a sign, and the forms `Number` would read, `0x10`, `1e3`
or `12.0`. So is a number beyond the safe integers of JavaScript, which no stored version reaches.
The ids of the path and the body are checked as strictly, and the decorator and its helper live in
`libs/http` next to `IdempotencyKey` (see `039-api-surface.md`). The update, publish and archive of
a product and the update and resolve of a note read it.

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
