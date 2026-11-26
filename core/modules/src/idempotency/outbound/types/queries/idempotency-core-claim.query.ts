import type { IdempotencyKey } from '@acme-core/entities';

export type IIdempotencyCoreClaimInsertQuery = Pick<
  IdempotencyKey,
  'scope' | 'idempotencyKey' | 'requestFingerprint' | 'status' | 'responseBody'
>;

export interface IIdempotencyCoreClaimFindByKeyQuery {
  scope: string;
  key: string;
}
