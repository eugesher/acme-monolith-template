import type { LedgerActionEnum, LedgerSubjectTypeEnum } from '@acme-libs/kernel';

import type { ILedgerRecordProcessorPayload } from '../../queues/ledger-record.queue';

export type ILedgerCoreEnqueueCommand = Omit<
  ILedgerRecordProcessorPayload,
  'action' | 'correlationId' | 'subjectType'
> & {
  subjectType: LedgerSubjectTypeEnum;
  action: LedgerActionEnum;
};
