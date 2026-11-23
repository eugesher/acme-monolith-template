import type { DynamicModule } from '@nestjs/common';

import { BullSetupModule } from '@acme-libs/queue';

export class ProductStockPostSubtractQueue {
  public static readonly NAME = 'product-stock-post-subtract';

  public static register(): DynamicModule {
    return BullSetupModule.registerQueue(ProductStockPostSubtractQueue.NAME);
  }
}
