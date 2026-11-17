import type { IdempotencyStatusEnum } from '@acme-libs/kernel';
import type { Nullable } from '@acme-libs/toolkit';

export interface IIdempotencyCoreKeyReconstitute {
  requestFingerprint: string;
  status: IdempotencyStatusEnum;
  responseBody: Nullable<string>;
}
