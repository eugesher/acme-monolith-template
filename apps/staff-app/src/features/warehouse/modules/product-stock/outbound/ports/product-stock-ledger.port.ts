import type { IProductStockLedgerRecordAddedCommand } from '../types';

export interface IProductStockLedgerPort {
  recordAdded(command: IProductStockLedgerRecordAddedCommand): Promise<void>;
}

export const PRODUCT_STOCK_LEDGER_PORT = Symbol('PRODUCT_STOCK_LEDGER_PORT');
