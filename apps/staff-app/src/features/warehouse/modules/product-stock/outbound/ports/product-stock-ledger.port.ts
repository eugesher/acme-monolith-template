import type { IProductStockLedgerAppendAddedCommand } from '../types';

export interface IProductStockLedgerPort {
  appendAdded(command: IProductStockLedgerAppendAddedCommand): Promise<void>;
}

export const PRODUCT_STOCK_LEDGER_PORT = Symbol('PRODUCT_STOCK_LEDGER_PORT');
