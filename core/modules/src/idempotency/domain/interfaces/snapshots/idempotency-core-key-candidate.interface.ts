import type { IdempotencyStatusEnum } from '@acme-libs/kernel';
import type { Nullable } from '@acme-libs/toolkit';

export interface IIdempotencyCoreKeyCandidate {
  scope: string;
  idempotencyKey: string;
  requestFingerprint: string;
  status: IdempotencyStatusEnum;
  responseBody: Nullable<string>;
}
