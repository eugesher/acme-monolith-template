import type {
  IProductLedgerAppendCreatedCommand,
  IProductLedgerAppendPublishedCommand,
} from '../types';

export interface IProductLedgerPort {
  appendCreated(command: IProductLedgerAppendCreatedCommand): Promise<void>;
  appendPublished(command: IProductLedgerAppendPublishedCommand): Promise<void>;
}

export const PRODUCT_LEDGER_PORT = Symbol('PRODUCT_LEDGER_PORT');
