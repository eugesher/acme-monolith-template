import type { ProductStatusEnum } from '@acme-libs/kernel';

export interface IProductCoreArchiveLedgerPayload {
  readonly subjectId: string;
  readonly version: number;
  readonly occurredAt: string;
  readonly payload: {
    readonly sku: string;
    readonly previousStatus: ProductStatusEnum;
  };
}
