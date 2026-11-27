import { Module } from '@nestjs/common';

import { IdempotencyPurgeProcessCase, IdempotencyPurgeScheduleCase } from '../application';
import {
  IdempotencyPurgeConfigIdempotencyInFlightTtlMinutesProvider,
  IdempotencyPurgeConfigIdempotencyKeyTtlHoursProvider,
  IdempotencyPurgeProcessRepository,
  IdempotencyPurgeScheduleQueueAdapter,
} from '../infrastructure';
import { IdempotencyPurgeQueue } from '../queues';
import { IdempotencyPurgeProcessor } from './idempotency-purge.processor';

@Module({
  imports: [IdempotencyPurgeQueue.register()],
  providers: [
    IdempotencyPurgeProcessor,
    IdempotencyPurgeScheduleCase,
    IdempotencyPurgeProcessCase,
    IdempotencyPurgeProcessRepository.PROVIDER,
    IdempotencyPurgeScheduleQueueAdapter.PROVIDER,
    IdempotencyPurgeConfigIdempotencyKeyTtlHoursProvider,
    IdempotencyPurgeConfigIdempotencyInFlightTtlMinutesProvider,
  ],
})
export class IdempotencyPurgeModule {}
