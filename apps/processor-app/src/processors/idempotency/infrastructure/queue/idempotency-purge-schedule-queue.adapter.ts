import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, type ClassProvider } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { IDEMPOTENCY_PURGE_QUEUE } from '@acme-processor/contracts/idempotency';

import {
  IDEMPOTENCY_PURGE_SCHEDULE_PORT,
  type IIdempotencyPurgeSchedulePort,
  type IIdempotencyPurgeScheduleRegisterCommand,
} from '../../outbound';

@Injectable()
export class IdempotencyPurgeScheduleQueueAdapter implements IIdempotencyPurgeSchedulePort {
  public static readonly provider: ClassProvider<IIdempotencyPurgeSchedulePort> = {
    provide: IDEMPOTENCY_PURGE_SCHEDULE_PORT,
    useClass: IdempotencyPurgeScheduleQueueAdapter,
  };

  constructor(
    @InjectQueue(IDEMPOTENCY_PURGE_QUEUE)
    private readonly queue: Queue,
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
