import type { Nullable } from '@acme-libs/toolkit';

import type {
  IdempotencyCoreClaimInsertOutcomeEnum,
  IIdempotencyCoreClaimFindQuery,
  IIdempotencyCoreClaimInsertQuery,
  IIdempotencyCoreClaimRecord,
} from '../types';

export interface IIdempotencyCoreClaimRepositoryPort {
  insert(query: IIdempotencyCoreClaimInsertQuery): Promise<IdempotencyCoreClaimInsertOutcomeEnum>;
  findByKey(query: IIdempotencyCoreClaimFindQuery): Promise<Nullable<IIdempotencyCoreClaimRecord>>;
}

export const IDEMPOTENCY_CORE_CLAIM_REPOSITORY_PORT = Symbol(
  'IDEMPOTENCY_CORE_CLAIM_REPOSITORY_PORT',
);
