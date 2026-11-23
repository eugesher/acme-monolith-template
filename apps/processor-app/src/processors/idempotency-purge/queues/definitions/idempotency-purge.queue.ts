import type { DynamicModule } from '@nestjs/common';

import { BullSetupModule } from '@acme-libs/queue';

export class IdempotencyPurgeQueue {
  public static readonly NAME = 'idempotency-purge';

  public static register(): DynamicModule {
    return BullSetupModule.registerQueue(IdempotencyPurgeQueue.NAME);
  }
}
