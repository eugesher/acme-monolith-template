import { Module } from '@nestjs/common';

import { IdempotencyPurgeScheduleUseCase, IdempotencyPurgeUseCase } from '../application';
import {
  IdempotencyPurgeConfigIdempotencyInFlightTtlMinutesProvider,
  IdempotencyPurgeConfigIdempotencyKeyTtlHoursProvider,
  IdempotencyPurgeRepository,
  IdempotencyPurgeScheduleQueueAdapter,
} from '../infrastructure';
import { IdempotencyPurgeQueue } from '../queues';
import { IdempotencyPurgeProcessor } from './idempotency-purge.processor';

@Module({
  imports: [IdempotencyPurgeQueue.register()],
  providers: [
    IdempotencyPurgeProcessor,
    IdempotencyPurgeScheduleUseCase,
    IdempotencyPurgeUseCase,
    IdempotencyPurgeRepository.provider,
    IdempotencyPurgeScheduleQueueAdapter.provider,
    IdempotencyPurgeConfigIdempotencyKeyTtlHoursProvider,
    IdempotencyPurgeConfigIdempotencyInFlightTtlMinutesProvider,
  ],
})
export class IdempotencyPurgeModule {}
