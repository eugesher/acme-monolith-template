import type { IProductCoreLedgerAppendArchivedCommand } from '../types';

export interface IProductCoreLedgerPort {
  appendArchived(command: IProductCoreLedgerAppendArchivedCommand): Promise<void>;
}

export const PRODUCT_CORE_LEDGER_PORT = Symbol('PRODUCT_CORE_LEDGER_PORT');
