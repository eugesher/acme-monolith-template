# 041 — Failed jobs

`apps/staff-app/src/features/queue` shows the staff the jobs that ran out of attempts and lets them
return such a job to the queue or delete it. The jobs run in processor-app (see
`023-processor-app.md`); the routes live in staff-app, next to the rest of the staff API, and the
two apps meet in one Redis.

| Route                                              | Permission     | What it does                                      |
| -------------------------------------------------- | -------------- | ------------------------------------------------- |
| `GET /queues`                                      | `queue:read`   | every queue, its pause and the counts of its jobs |
| `GET /queues/:queueName/jobs/failed`               | `queue:read`   | a page of the failed jobs, newest first           |
| `POST /queues/:queueName/jobs/failed/:jobId/retry` | `queue:retry`  | returns the job to the queue                      |
| `DELETE /queues/:queueName/jobs/failed/:jobId`     | `queue:delete` | removes the job                                   |

**A queue is read, not processed.** `QueueRegistryModule` next to the adapter mounts
`LedgerQueueModule` and `ProductStockPostSubtractQueueModule` of `@acme-core/queues` (see
`032-queue-lib.md`), and `QueueRegistryAdapter` injects them. A BullMQ queue without a worker reads
and moves jobs and runs none, so staff-app takes no job from processor-app.

**A pause belongs to the queue, not to a job.** BullMQ keeps the jobs of a paused queue waiting and
marks the queue, so each queue answers `paused` from `isPaused()` and the counts of five states from
`getJobCounts('active', 'completed', 'failed', 'delayed', 'waiting')`. The template neither
prioritizes jobs nor builds flows, so the states `prioritized` and `waiting-children` stay out of
the answer.

**A failed job answers what the staff acts on, not the job of BullMQ.** `QueueRegistryAdapter` maps
each job to the view of its port: the id as a string, the name, the `data`, `attempts` and
`attemptsMade`, the `failedReason` and the `stacktrace`, and the instants `createdAt`, `processedAt`
and `failedAt` as ISO strings in UTC, `null` when BullMQ has none. The options, the progress and the
return value of BullMQ stay in the adapter, so an upgrade of BullMQ does not change the response.

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
