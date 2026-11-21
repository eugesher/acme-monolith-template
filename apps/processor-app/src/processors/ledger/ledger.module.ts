import { Module } from '@nestjs/common';

import { LedgerQueueModule } from '@acme-core/queues';

import { LedgerAppendReportFailureUseCase, LedgerAppendUseCase } from './application';
import { LedgerAppendRepository } from './infrastructure';
import { LedgerAppendProcessor } from './presentation';

@Module({
  imports: [LedgerQueueModule],
  providers: [
    LedgerAppendProcessor,
    LedgerAppendUseCase,
    LedgerAppendReportFailureUseCase,
    LedgerAppendRepository.provider,
  ],
})
export class LedgerModule {}
