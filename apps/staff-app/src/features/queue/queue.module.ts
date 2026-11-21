import { Module } from '@nestjs/common';

import { HttpExceptionFilter } from '@acme-libs/http';

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
    HttpExceptionFilter,
    QueueListUseCase,
    QueueListFailedJobsUseCase,
    QueueRetryFailedJobUseCase,
    QueueDeleteFailedJobUseCase,
    QueueFailedJobService,
  ],
})
export class QueueModule {}
