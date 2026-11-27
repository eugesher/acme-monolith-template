import { Module } from '@nestjs/common';

import { LedgerAppendQueue, ProductStockPostSubtractQueue } from '@acme-core/queues';

import {
  QueueDeleteFailedJobCase,
  QueueFailedJobService,
  QueueGetFailedJobsCase,
  QueueGetManyCase,
  QueueRetryFailedJobCase,
} from '../application';
import { QueueRegistryAdapter } from '../infrastructure';
import { QueueController } from './queue.controller';

@Module({
  imports: [LedgerAppendQueue.register(), ProductStockPostSubtractQueue.register()],
  controllers: [QueueController],
  providers: [
    QueueGetManyCase,
    QueueGetFailedJobsCase,
    QueueRetryFailedJobCase,
    QueueDeleteFailedJobCase,
    QueueFailedJobService,
    QueueRegistryAdapter.PROVIDER,
  ],
})
export class QueueModule {}
