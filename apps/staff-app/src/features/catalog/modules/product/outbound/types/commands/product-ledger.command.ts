import type { ProductStatusEnum } from '@acme-libs/kernel';

export interface IProductLedgerAppendCreatedCommand {
  subjectId: string;
  occurredAt: string;
  payload: {
    sku: string;
    name: string;
  };
}

export interface IProductLedgerAppendPublishedCommand {
  subjectId: string;
  version: number;
  occurredAt: string;
  payload: {
    sku: string;
    previousStatus: ProductStatusEnum;
  };
}
