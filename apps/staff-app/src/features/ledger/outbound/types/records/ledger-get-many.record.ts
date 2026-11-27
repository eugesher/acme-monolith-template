import type { LedgerEntry } from '@acme-core/entities';

export type ILedgerGetManyRecordItem = Pick<
  LedgerEntry,
  | 'id'
  | 'operationKey'
  | 'subjectType'
  | 'subjectId'
  | 'action'
  | 'payload'
  | 'correlationId'
  | 'occurredAt'
  | 'recordedAt'
>;

export type ILedgerGetManyRecord = [ILedgerGetManyRecordItem[], number];
