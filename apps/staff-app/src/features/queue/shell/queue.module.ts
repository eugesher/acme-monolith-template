import { Module } from '@nestjs/common';

import { LedgerQueueModule, ProductStockPostSubtractQueueModule } from '@acme-core/queues';

import {
  QueueDeleteFailedJobUseCase,
  QueueFailedJobService,
  QueueListFailedJobsUseCase,
  QueueListUseCase,
  QueueRetryFailedJobUseCase,
} from '../application';
import { QueueRegistryAdapter } from '../infrastructure';
import { QueueController } from './queue.controller';

@Module({
  imports: [LedgerQueueModule, ProductStockPostSubtractQueueModule],
  controllers: [QueueController],
  providers: [
    QueueListUseCase,
    QueueListFailedJobsUseCase,
    QueueRetryFailedJobUseCase,
    QueueDeleteFailedJobUseCase,
    QueueFailedJobService,
    QueueRegistryAdapter.provider,
  ],
})
export class QueueModule {}
