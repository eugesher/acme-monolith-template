import type { ILedgerCoreAppendEnqueueCommand } from '../types';

export interface ILedgerCorePort {
  handleAppendEnqueue(command: ILedgerCoreAppendEnqueueCommand): Promise<void>;
}

export const LEDGER_CORE_PORT = Symbol('LEDGER_CORE_PORT');
