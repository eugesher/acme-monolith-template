import type { Maybe } from '@acme-libs/toolkit';

export interface IProductCoreArchiveLoggerPayload {
  readonly id: string;
  readonly version: Maybe<number>;
}
