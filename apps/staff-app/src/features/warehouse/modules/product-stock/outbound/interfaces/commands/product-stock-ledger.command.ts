export interface IProductStockLedgerRecordAddedCommand {
  productStockId: string;
  subjectId: string;
  payload: {
    sku: string;
    quantity: number;
  };
}
