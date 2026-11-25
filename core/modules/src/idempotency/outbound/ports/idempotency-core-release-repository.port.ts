import type { IIdempotencyCoreReleaseDeleteInFlightQuery } from '../types';

export interface IIdempotencyCoreReleaseRepositoryPort {
  deleteInFlight(query: IIdempotencyCoreReleaseDeleteInFlightQuery): Promise<void>;
}

export const IDEMPOTENCY_CORE_RELEASE_REPOSITORY_PORT = Symbol(
  'IDEMPOTENCY_CORE_RELEASE_REPOSITORY_PORT',
);
