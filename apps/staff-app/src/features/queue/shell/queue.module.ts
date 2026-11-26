import { Module } from '@nestjs/common';

import { LedgerAppendQueue, ProductStockPostSubtractQueue } from '@acme-core/queues';

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
  imports: [LedgerAppendQueue.register(), ProductStockPostSubtractQueue.register()],
  controllers: [QueueController],
  providers: [
    QueueListUseCase,
    QueueListFailedJobsUseCase,
    QueueRetryFailedJobUseCase,
    QueueDeleteFailedJobUseCase,
    QueueFailedJobService,
    QueueRegistryAdapter.PROVIDER,
  ],
})
export class QueueModule {}
