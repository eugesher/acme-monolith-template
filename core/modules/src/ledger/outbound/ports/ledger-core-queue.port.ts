import type { ILedgerCoreQueueAddCommand } from '../types';

export interface ILedgerCoreQueuePort {
  add(command: ILedgerCoreQueueAddCommand): Promise<void>;
}

export const LEDGER_CORE_QUEUE_PORT = Symbol('LEDGER_CORE_QUEUE_PORT');
