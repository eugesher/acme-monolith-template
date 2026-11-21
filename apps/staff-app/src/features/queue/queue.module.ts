import { Module } from '@nestjs/common';

import {
  QueueDeleteFailedJobUseCase,
  QueueFailedJobService,
  QueueListFailedJobsUseCase,
  QueueListUseCase,
  QueueRetryFailedJobUseCase,
} from './application';
import { QueueRegistryModule } from './infrastructure';
import { QueueController } from './presentation';

@Module({
  imports: [QueueRegistryModule],
  controllers: [QueueController],
  providers: [
    QueueListUseCase,
    QueueListFailedJobsUseCase,
    QueueRetryFailedJobUseCase,
    QueueDeleteFailedJobUseCase,
    QueueFailedJobService,
  ],
})
export class QueueModule {}
