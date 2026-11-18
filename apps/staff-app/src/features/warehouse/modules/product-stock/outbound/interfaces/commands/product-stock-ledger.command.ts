export interface IProductStockLedgerRecordAddedCommand {
  productStockId: string;
  subjectId: string;
  occurredAt: string;
  payload: {
    sku: string;
    quantity: number;
  };
}
