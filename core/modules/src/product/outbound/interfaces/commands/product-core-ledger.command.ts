import type { ProductStatusEnum } from '@acme-libs/kernel';

export interface IProductCoreLedgerRecordArchivedCommand {
  subjectId: string;
  version: number;
  occurredAt: string;
  payload: {
    sku: string;
    previousStatus: ProductStatusEnum;
  };
}
