export interface IProductStockAddLedgerPayload {
  readonly productStockId: string;
  readonly subjectId: string;
  readonly payload: {
    readonly sku: string;
    readonly quantity: number;
  };
}
