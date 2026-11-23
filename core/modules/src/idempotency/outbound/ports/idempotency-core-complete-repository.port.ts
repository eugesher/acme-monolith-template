import type { IIdempotencyCoreCompleteQuery } from '../types';

export interface IIdempotencyCoreCompleteRepositoryPort {
  complete(query: IIdempotencyCoreCompleteQuery): Promise<void>;
}

export const IDEMPOTENCY_CORE_COMPLETE_REPOSITORY_PORT = Symbol(
  'IDEMPOTENCY_CORE_COMPLETE_REPOSITORY_PORT',
);
