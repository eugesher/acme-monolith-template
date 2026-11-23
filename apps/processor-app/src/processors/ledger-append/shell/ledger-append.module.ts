import { Module } from '@nestjs/common';

import { LedgerQueue } from '@acme-core/queues';

import { LedgerAppendReportFailureUseCase, LedgerAppendUseCase } from '../application';
import { LedgerAppendRepository } from '../infrastructure';
import { LedgerAppendProcessor } from './ledger-append.processor';

@Module({
  imports: [LedgerQueue.register()],
  providers: [
    LedgerAppendProcessor,
    LedgerAppendUseCase,
    LedgerAppendReportFailureUseCase,
    LedgerAppendRepository.PROVIDER,
  ],
})
export class LedgerAppendModule {}
