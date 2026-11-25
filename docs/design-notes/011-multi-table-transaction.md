# 011 — Multi-table transaction

One use case writes two tables in one transaction through one repository port, with optimistic
concurrency on the first.

| Part          | Example                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| use case      | `apps/staff-app/src/features/tools/modules/note/application/use-cases/note-update.use-case.ts`                     |
| port          | `apps/staff-app/src/features/tools/modules/note/outbound/ports/note-update-repository.port.ts`                     |
| repository    | `apps/staff-app/src/features/tools/modules/note/infrastructure/persistence/repositories/note-update.repository.ts` |
| write service | `apps/staff-app/src/features/tools/modules/note/application/services/note-write.service.ts`                        |

```ts
interface INoteUpdateRepositoryPort {
  update(query: INoteUpdateQuery): Promise<boolean>;
  appendRevision(query: INoteUpdateAppendRevisionQuery): Promise<void>;
}
```

## The transaction comes from the context

The use case hands `NoteWriteService.write` a `save` that wraps the two calls in `run` of the
transaction port of its module (see `007-optimistic-concurrency.md` and `026-transaction-port.md`),
and the repository reads its tables through `ORM_PORT`, so the two statements share one transaction
without passing anything to each other. A failed second insert fails `run`, and the first update
rolls back with it.

## Read before, re-read after

One attempt of the write service:

1. load the row, check the `If-Match` version and remember the version as read;
2. apply the change; stop here if the version did not change;
3. `save`, in a transaction: update where the version is still the one read, then insert the second
   row only if the update changed a row;
4. after the transaction: read the row again, and answer it or report the lost race.

The `WHERE version = <as read>` of step 3 makes a read inside the transaction unnecessary. Keeping
the re-read of step 4 outside matters: under `REPEATABLE READ`, a read inside a transaction that
lost the race would still see the snapshot from before the winner's commit, and would report a stale
`currentVersion`.

**A unique index is the last guard.** `UNIQUE (note_id, note_version)` refuses a second row for one
version even if two writers passed the version check.

**The correlation id of the request goes into the row**, read with
`CorrelationContextHelper.current` in the use case, so the command carries none.

## Scoped access

`apps/staff-app/src/features/tools/modules/note/application/services/note-access.service.ts` loads a
row through a query filtered by the caller and refuses an empty result with one 404, so an id never
reveals that another row exists. Every query takes the caller as a required filter.

## Shared update through a base repository

The update and resolve repositories share `update` through
`apps/staff-app/src/features/tools/modules/note/infrastructure/persistence/repositories/base/note-base.repository.ts`;
the product module shares `findOne` the same way.

**The base speaks for every port it serves.** Each port keeps its own types, so a shared method
takes the union of their queries and answers the intersection of their records:
`update(query: INoteUpdateQuery | INoteResolveUpdateQuery)`,
`findOne(): Promise<Nullable<IProductAccessRecord & IProductWriteRecord>>`, and the lock and the sum
of core `ProductStockCoreBaseRepository` for the lock and move ports. No port lends its name to the
other.
