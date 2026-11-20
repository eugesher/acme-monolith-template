import { Module } from '@nestjs/common';

import { IdempotencyPurgeQueueModule } from '@acme-processor/common/shared';

import { IdempotencyPurgeScheduleUseCase, IdempotencyPurgeUseCase } from './application';
import {
  IdempotencyConfigInFlightTtlMinutesProvider,
  IdempotencyConfigKeyTtlHoursProvider,
  IdempotencyPurgeRepository,
  IdempotencyPurgeScheduleQueueAdapter,
} from './infrastructure';
import { IdempotencyPurgeProcessor } from './presentation';

@Module({
  imports: [IdempotencyPurgeQueueModule],
  providers: [
    IdempotencyPurgeProcessor,
    IdempotencyPurgeScheduleUseCase,
    IdempotencyPurgeUseCase,
    IdempotencyPurgeRepository.provider,
    IdempotencyPurgeScheduleQueueAdapter.provider,
    IdempotencyConfigKeyTtlHoursProvider,
    IdempotencyConfigInFlightTtlMinutesProvider,
  ],
})
export class IdempotencyModule {}
