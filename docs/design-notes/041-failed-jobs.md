# 041 — Failed jobs

`apps/staff-app/src/features/queue` shows the staff the jobs that ran out of attempts and lets them
return such a job to the queue or delete it. The jobs run in processor-app (see
`023-processor-app.md`); the routes live in staff-app, next to the rest of the staff API, and the
two apps meet in one Redis.

| Route                                              | Permission     | What it does                            |
| -------------------------------------------------- | -------------- | --------------------------------------- |
| `GET /queues`                                      | `queue:read`   | every queue with the counts of its jobs |
| `GET /queues/:queueName/jobs/failed`               | `queue:read`   | a page of the failed jobs, newest first |
| `POST /queues/:queueName/jobs/failed/:jobId/retry` | `queue:retry`  | returns the job to the queue            |
| `DELETE /queues/:queueName/jobs/failed/:jobId`     | `queue:delete` | removes the job                         |

**A queue is read, not processed.** The feature registers `ledger-record` and
`product-stock-post-subtract` through the `common/shared` of staff-app with
`BullSetupModule.registerQueue` (see `032-queue-lib.md`), and `QueueRegistryQueueAdapter` injects
them. A Bull queue without a processor reads and moves jobs and runs none, so staff-app takes no job
from processor-app.

**The counts are read field by field.** `getJobCounts()` of Bull answers the paused jobs too, but
its type does not declare them, so the adapter takes the five counts it declares and
`getPausedCount()` for the sixth; every count is a number.

**A failed job answers what the staff acts on, not the job of Bull.** `QueueRegistryQueueAdapter`
maps each job to the view of its port: the id as a string, the name, the `data`, `attempts` and
`attemptsMade`, the `failedReason` and the `stacktrace`, and the instants `createdAt`, `processedAt`
and `failedAt` as ISO strings in UTC, `null` when Bull has none. The options, the progress and the
return value of Bull stay in the adapter, so an upgrade of Bull does not change the response.

An unknown queue or job answers 404, a job that is not failed 409. A retried job keeps its
`attemptsMade`, so its next failure sends it straight back to the failed set: a retry is one more
attempt, not a new round. The ledger deduplicates on the operation key, so retrying a ledger record
that did append writes nothing.

**Both actions log the staff user.** A retry logs `Failed job returned to the queue` at `info` with
the queue, the job id and `staffUserId`. A delete logs `Failed job deleted` at `warn` with the same
fields and the `data` of the job: a deleted ledger record never reaches the ledger, and the log is
the only place it can be restored from.

**The e2e suite of staff-app fails a job by hand**, since no processor runs there, and the system
suite of staff-app checks that a returned record reaches the ledger (see `014-e2e-suites.md`).
