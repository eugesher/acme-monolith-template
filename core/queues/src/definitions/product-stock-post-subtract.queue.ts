import type { DynamicModule } from '@nestjs/common';

import { QueueNameEnum } from '@acme-libs/kernel';
import { BullSetupModule } from '@acme-libs/queue';

export class ProductStockPostSubtractQueue {
  public static readonly NAME = QueueNameEnum.PRODUCT_STOCK_POST_SUBTRACT;

  public static register(): DynamicModule {
    return BullSetupModule.registerQueue(ProductStockPostSubtractQueue.NAME);
  }
}
