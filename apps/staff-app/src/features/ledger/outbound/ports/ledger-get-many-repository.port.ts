import type { ILedgerGetManyListQuery, ILedgerGetManyRecord } from '../types';

export interface ILedgerGetManyRepositoryPort {
  list(query: ILedgerGetManyListQuery): Promise<ILedgerGetManyRecord>;
}

export const LEDGER_LIST_ENTRIES_REPOSITORY_PORT = Symbol('LEDGER_LIST_ENTRIES_REPOSITORY_PORT');
