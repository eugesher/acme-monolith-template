import { Module } from '@nestjs/common';

import { LedgerAppendQueue } from '@acme-core/queues';

import { LedgerAppendProcessCase, LedgerAppendReportWorkerFailedCase } from '../application';
import { LedgerAppendProcessRepository } from '../infrastructure';
import { LedgerAppendProcessor } from './ledger-append.processor';

@Module({
  imports: [LedgerAppendQueue.register()],
  providers: [
    LedgerAppendProcessor,
    LedgerAppendProcessCase,
    LedgerAppendReportWorkerFailedCase,
    LedgerAppendProcessRepository.PROVIDER,
  ],
})
export class LedgerAppendModule {}
