import type {
  IProductLedgerRecordCreatedCommand,
  IProductLedgerRecordPublishedCommand,
} from '../interfaces';

export interface IProductLedgerPort {
  recordCreated(command: IProductLedgerRecordCreatedCommand): Promise<void>;
  recordPublished(command: IProductLedgerRecordPublishedCommand): Promise<void>;
}

export const PRODUCT_LEDGER_PORT = Symbol('PRODUCT_LEDGER_PORT');
