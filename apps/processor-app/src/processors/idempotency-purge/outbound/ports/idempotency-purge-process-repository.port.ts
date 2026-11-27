export interface IIdempotencyPurgeProcessRepositoryPort {
  deleteCreatedBefore(cutoff: Date): Promise<number>;
  deleteInFlightCreatedBefore(cutoff: Date): Promise<number>;
}

export const IDEMPOTENCY_PURGE_PROCESS_REPOSITORY_PORT = Symbol(
  'IDEMPOTENCY_PURGE_PROCESS_REPOSITORY_PORT',
);
