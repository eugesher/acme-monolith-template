import type { IOrderLedgerAppendPlacedCommand } from '../types';

export interface IOrderLedgerPort {
  appendPlaced(command: IOrderLedgerAppendPlacedCommand): Promise<void>;
}

export const ORDER_LEDGER_PORT = Symbol('ORDER_LEDGER_PORT');
