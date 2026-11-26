import type { ProductStatusEnum } from '@acme-libs/kernel';

export interface IProductCoreLedgerAppendArchivedCommand {
  subjectId: string;
  version: number;
  occurredAt: string;
  payload: {
    sku: string;
    previousStatus: ProductStatusEnum;
  };
}
