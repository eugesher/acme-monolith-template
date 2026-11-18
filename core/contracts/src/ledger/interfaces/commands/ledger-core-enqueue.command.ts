import type { LedgerCoreActionEnum } from '../../enums/ledger-core-action.enum';
import type { LedgerCoreSubjectTypeEnum } from '../../enums/ledger-core-subject-type.enum';
import type { ILedgerRecordProcessorPayload } from '../../queues/ledger-record.queue';

export type ILedgerCoreEnqueueCommand = Omit<
  ILedgerRecordProcessorPayload,
  'action' | 'correlationId' | 'subjectType'
> & {
  subjectType: LedgerCoreSubjectTypeEnum;
  action: LedgerCoreActionEnum;
};
