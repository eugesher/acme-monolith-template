import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';

import {
  IDEMPOTENCY_PURGE_QUEUE,
  type IIdempotencyPurgePayload,
  type IIdempotencyPurgeSchedulePort,
  type IIdempotencyPurgeScheduleRegisterCommand,
} from '../../outbound';

@Injectable()
export class IdempotencyPurgeScheduleQueueAdapter implements IIdempotencyPurgeSchedulePort {
  constructor(
    @InjectQueue(IDEMPOTENCY_PURGE_QUEUE)
    private readonly queue: Queue<IIdempotencyPurgePayload>,
  ) {}

  public async register(command: IIdempotencyPurgeScheduleRegisterCommand): Promise<void> {
    const { pattern } = command;

    await this.queue.upsertJobScheduler(
      IDEMPOTENCY_PURGE_QUEUE,
      { pattern },
      { name: IDEMPOTENCY_PURGE_QUEUE },
    );
  }
}
