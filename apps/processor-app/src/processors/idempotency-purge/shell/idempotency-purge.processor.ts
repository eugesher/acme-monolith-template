import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { OnApplicationBootstrap } from '@nestjs/common';

import { CorrelationContextHelper } from '@acme-libs/observability';

import { IdempotencyPurgeProcessCase, IdempotencyPurgeScheduleCase } from '../application';
import { IdempotencyPurgeQueue } from '../queues';

@Processor(IdempotencyPurgeQueue.NAME)
export class IdempotencyPurgeProcessor extends WorkerHost implements OnApplicationBootstrap {
  constructor(
    private readonly scheduleCase: IdempotencyPurgeScheduleCase,
    private readonly processCase: IdempotencyPurgeProcessCase,
  ) {
    super();
  }

  public async onApplicationBootstrap(): Promise<void> {
    await CorrelationContextHelper.run(undefined, () => this.scheduleCase.execute());
  }

  public async process(): Promise<void> {
    await CorrelationContextHelper.run(undefined, () => this.processCase.execute());
  }
}
