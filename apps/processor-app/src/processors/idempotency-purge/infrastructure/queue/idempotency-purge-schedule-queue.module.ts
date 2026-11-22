import { Module, type ClassProvider } from '@nestjs/common';

import { BullSetupModule } from '@acme-libs/queue';

import {
  IDEMPOTENCY_PURGE_QUEUE,
  IDEMPOTENCY_PURGE_SCHEDULE_PORT,
  type IIdempotencyPurgeSchedulePort,
} from '../../outbound';
import { IdempotencyPurgeScheduleQueueAdapter } from './idempotency-purge-schedule-queue.adapter';

@Module({
  imports: [BullSetupModule.registerQueue(IDEMPOTENCY_PURGE_QUEUE)],
  exports: [IDEMPOTENCY_PURGE_SCHEDULE_PORT],
  providers: [
    {
      provide: IDEMPOTENCY_PURGE_SCHEDULE_PORT,
      useClass: IdempotencyPurgeScheduleQueueAdapter,
    } satisfies ClassProvider<IIdempotencyPurgeSchedulePort>,
  ],
})
export class IdempotencyPurgeScheduleQueueModule {}
