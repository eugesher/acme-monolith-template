import type {
  ILedgerAppendProcessEntryInsertQuery,
  ILedgerAppendProcessEntryInsertRecord,
  ILedgerAppendProcessEntryRecord,
} from '../types';

export interface ILedgerAppendProcessRepositoryPort {
  insert(
    record: ILedgerAppendProcessEntryInsertQuery,
  ): Promise<ILedgerAppendProcessEntryInsertRecord>;
  findByOperationKey(operationKey: string): Promise<ILedgerAppendProcessEntryRecord>;
}

export const LEDGER_APPEND_PROCESS_REPOSITORY_PORT = Symbol(
  'LEDGER_APPEND_PROCESS_REPOSITORY_PORT',
);
