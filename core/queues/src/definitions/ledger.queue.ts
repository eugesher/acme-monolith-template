import type { DynamicModule } from '@nestjs/common';

import { BullSetupModule } from '@acme-libs/queue';

export class LedgerQueue {
  public static readonly NAME = 'ledger-record';

  public static register(): DynamicModule {
    return BullSetupModule.registerQueue(LedgerQueue.NAME);
  }
}
