import type { LedgerEntry } from '@acme-core/entities';

export type ILedgerAppendProcessEntryInsertQuery = Pick<
  LedgerEntry,
  | 'operationKey'
  | 'subjectType'
  | 'subjectId'
  | 'action'
  | 'payload'
  | 'correlationId'
  | 'occurredAt'
>;
