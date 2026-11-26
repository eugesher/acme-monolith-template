export interface IProductStockPostSubtractTransactionPort {
  run<T>(work: () => Promise<T>): Promise<T>;
}

export const PRODUCT_STOCK_POST_SUBTRACT_TRANSACTION_PORT = Symbol(
  'PRODUCT_STOCK_POST_SUBTRACT_TRANSACTION_PORT',
);
