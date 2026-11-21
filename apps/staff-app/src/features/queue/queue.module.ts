import { Module } from '@nestjs/common';

import { HttpExceptionFilter } from '@acme-libs/http';
import { LedgerQueueModule, ProductStockPostSubtractQueueModule } from '@acme-core/queues';

import {
  QueueDeleteFailedJobUseCase,
  QueueFailedJobService,
  QueueListFailedJobsUseCase,
  QueueListUseCase,
  QueueRetryFailedJobUseCase,
} from './application';
import { QueueRegistryAdapter } from './infrastructure';
import { QueueController } from './presentation';

@Module({
  imports: [LedgerQueueModule, ProductStockPostSubtractQueueModule],
  controllers: [QueueController],
  providers: [
    HttpExceptionFilter,
    QueueListUseCase,
    QueueListFailedJobsUseCase,
    QueueRetryFailedJobUseCase,
    QueueDeleteFailedJobUseCase,
    QueueFailedJobService,
    QueueRegistryAdapter.provider,
  ],
})
export class QueueModule {}
