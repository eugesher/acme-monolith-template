import type { IAuthLedgerAppendRegisteredCommand } from '../types';

export interface IAuthLedgerPort {
  appendRegistered(command: IAuthLedgerAppendRegisteredCommand): Promise<void>;
}

export const AUTH_LEDGER_PORT = Symbol('AUTH_LEDGER_PORT');
