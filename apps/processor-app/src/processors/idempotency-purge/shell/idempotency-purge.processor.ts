import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { OnApplicationBootstrap } from '@nestjs/common';

import { CorrelationContextHelper } from '@acme-libs/observability';

import { IdempotencyPurgeScheduleUseCase, IdempotencyPurgeUseCase } from '../application';
import { IDEMPOTENCY_PURGE_QUEUE } from '../outbound';

@Processor(IDEMPOTENCY_PURGE_QUEUE)
export class IdempotencyPurgeProcessor extends WorkerHost implements OnApplicationBootstrap {
  constructor(
    private readonly schedule: IdempotencyPurgeScheduleUseCase,
    private readonly purge: IdempotencyPurgeUseCase,
  ) {
    super();
  }

  public async onApplicationBootstrap(): Promise<void> {
    await CorrelationContextHelper.run(undefined, () => this.schedule.execute());
  }

  public async process(): Promise<void> {
    await CorrelationContextHelper.run(undefined, () => this.purge.execute());
  }
}
