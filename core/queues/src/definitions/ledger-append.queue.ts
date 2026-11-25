import type { DynamicModule } from '@nestjs/common';

import { QueueNameEnum } from '@acme-libs/kernel';
import { BullSetupModule } from '@acme-libs/queue';

export class LedgerAppendQueue {
  public static readonly NAME = QueueNameEnum.LEDGER_APPEND_QUEUE;

  public static register(): DynamicModule {
    return BullSetupModule.registerQueue(LedgerAppendQueue.NAME);
  }
}
