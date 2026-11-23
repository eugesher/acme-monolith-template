import type { DynamicModule } from '@nestjs/common';

import { BullSetupModule } from '@acme-libs/queue';
import { PRODUCT_STOCK_POST_SUBTRACT_QUEUE } from '@acme-core/contracts/product-stock';

export const ProductStockPostSubtractQueueModule: DynamicModule = BullSetupModule.registerQueue(
  PRODUCT_STOCK_POST_SUBTRACT_QUEUE,
);
