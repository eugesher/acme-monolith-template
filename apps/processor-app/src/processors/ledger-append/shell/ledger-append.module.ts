import { Module } from '@nestjs/common';

import { LedgerAppendQueue } from '@acme-core/queues';

import { LedgerAppendReportFailureUseCase, LedgerAppendUseCase } from '../application';
import { LedgerAppendRepository } from '../infrastructure';
import { LedgerAppendProcessor } from './ledger-append.processor';

@Module({
  imports: [LedgerAppendQueue.register()],
  providers: [
    LedgerAppendProcessor,
    LedgerAppendUseCase,
    LedgerAppendReportFailureUseCase,
    LedgerAppendRepository.PROVIDER,
  ],
})
export class LedgerAppendModule {}
