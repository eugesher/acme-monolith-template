import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, type ClassProvider } from '@nestjs/common';
import type { Queue } from 'bullmq';

import {
  IDEMPOTENCY_PURGE_SCHEDULE_PORT,
  type IIdempotencyPurgeSchedulePort,
  type IIdempotencyPurgeScheduleRegisterCommand,
} from '../../outbound';
import { IdempotencyPurgeQueue, type IIdempotencyPurgeQueuePayload } from '../../queues';

@Injectable()
export class IdempotencyPurgeScheduleQueueAdapter implements IIdempotencyPurgeSchedulePort {
  public static readonly provider: ClassProvider<IIdempotencyPurgeSchedulePort> = {
    provide: IDEMPOTENCY_PURGE_SCHEDULE_PORT,
    useClass: IdempotencyPurgeScheduleQueueAdapter,
  };

  constructor(
    @InjectQueue(IdempotencyPurgeQueue.NAME)
    private readonly queue: Queue<IIdempotencyPurgeQueuePayload>,
  ) {}

  public async register(command: IIdempotencyPurgeScheduleRegisterCommand): Promise<void> {
    const { pattern } = command;

    await this.queue.upsertJobScheduler(
      IdempotencyPurgeQueue.NAME,
      { pattern },
      { name: IdempotencyPurgeQueue.NAME },
    );
  }
}
