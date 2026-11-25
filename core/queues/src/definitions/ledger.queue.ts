import type { DynamicModule } from '@nestjs/common';

import { QueueNameEnum } from '@acme-libs/kernel';
import { BullSetupModule } from '@acme-libs/queue';

export class LedgerQueue {
  public static readonly NAME = QueueNameEnum.LEDGER_RECORD;

  public static register(): DynamicModule {
    return BullSetupModule.registerQueue(LedgerQueue.NAME);
  }
}
