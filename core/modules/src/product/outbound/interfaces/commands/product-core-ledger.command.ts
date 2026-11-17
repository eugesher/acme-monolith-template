import type { ProductStatusEnum } from '@acme-libs/kernel';

export interface IProductCoreLedgerRecordArchivedCommand {
  subjectId: string;
  version: number;
  payload: {
    sku: string;
    previousStatus: ProductStatusEnum;
  };
}
