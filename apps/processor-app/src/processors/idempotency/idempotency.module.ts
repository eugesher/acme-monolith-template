import { Module } from '@nestjs/common';

import { IdempotencyPurgeScheduleUseCase, IdempotencyPurgeUseCase } from './application';
import {
  IdempotencyConfigInFlightTtlMinutesProvider,
  IdempotencyConfigKeyTtlHoursProvider,
  IdempotencyPurgeRepository,
  IdempotencyPurgeScheduleQueueModule,
} from './infrastructure';
import { IdempotencyPurgeProcessor } from './presentation';

@Module({
  imports: [IdempotencyPurgeScheduleQueueModule],
  providers: [
    IdempotencyPurgeProcessor,
    IdempotencyPurgeScheduleUseCase,
    IdempotencyPurgeUseCase,
    IdempotencyPurgeRepository.provider,
    IdempotencyConfigKeyTtlHoursProvider,
    IdempotencyConfigInFlightTtlMinutesProvider,
  ],
})
export class IdempotencyModule {}
