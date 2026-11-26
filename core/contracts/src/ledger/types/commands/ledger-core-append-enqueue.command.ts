import type { LedgerActionEnum, LedgerSubjectTypeEnum } from '@acme-libs/kernel';

import type { ILedgerAppendProcessorPayload } from '../../queues/ledger-append.queue';

export type ILedgerCoreAppendEnqueueCommand = Omit<
  ILedgerAppendProcessorPayload,
  'action' | 'correlationId' | 'subjectType'
> & {
  subjectType: LedgerSubjectTypeEnum;
  action: LedgerActionEnum;
};
