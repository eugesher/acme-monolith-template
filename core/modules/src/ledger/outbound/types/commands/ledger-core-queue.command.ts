import type { ILedgerAppendProcessorPayload } from '@acme-core/contracts/ledger';

export interface ILedgerCoreQueueAddCommand {
  record: ILedgerAppendProcessorPayload;
  timeoutMs: number;
}
