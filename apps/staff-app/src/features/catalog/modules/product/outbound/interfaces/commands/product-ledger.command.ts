import type { ProductStatusEnum } from '@acme-libs/kernel';

export interface IProductLedgerRecordCreatedCommand {
  subjectId: string;
  occurredAt: string;
  payload: {
    sku: string;
    name: string;
  };
}

export interface IProductLedgerRecordPublishedCommand {
  subjectId: string;
  version: number;
  payload: {
    sku: string;
    previousStatus: ProductStatusEnum;
  };
}
