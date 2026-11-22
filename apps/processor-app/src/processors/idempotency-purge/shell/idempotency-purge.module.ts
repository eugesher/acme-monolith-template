import { Module } from '@nestjs/common';

import { IdempotencyPurgeScheduleUseCase, IdempotencyPurgeUseCase } from '../application';
import {
  IdempotencyPurgeConfigIdempotencyInFlightTtlMinutesProvider,
  IdempotencyPurgeConfigIdempotencyKeyTtlHoursProvider,
  IdempotencyPurgeRepository,
  IdempotencyPurgeScheduleQueueModule,
} from '../infrastructure';
import { IdempotencyPurgeProcessor } from './idempotency-purge.processor';

@Module({
  imports: [IdempotencyPurgeScheduleQueueModule],
  providers: [
    IdempotencyPurgeProcessor,
    IdempotencyPurgeScheduleUseCase,
    IdempotencyPurgeUseCase,
    IdempotencyPurgeRepository.provider,
    IdempotencyPurgeConfigIdempotencyKeyTtlHoursProvider,
    IdempotencyPurgeConfigIdempotencyInFlightTtlMinutesProvider,
  ],
})
export class IdempotencyPurgeModule {}
