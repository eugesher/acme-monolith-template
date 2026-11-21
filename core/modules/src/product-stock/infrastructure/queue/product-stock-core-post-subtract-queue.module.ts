import { Module, type ClassProvider } from '@nestjs/common';

import { ProductStockPostSubtractQueueModule } from '@acme-core/queues';

import {
  PRODUCT_STOCK_CORE_POST_SUBTRACT_PORT,
  type IProductStockCorePostSubtractPort,
} from '../../outbound';
import { ProductStockCorePostSubtractQueueAdapter } from './product-stock-core-post-subtract-queue.adapter';

@Module({
  imports: [ProductStockPostSubtractQueueModule],
  exports: [PRODUCT_STOCK_CORE_POST_SUBTRACT_PORT],
  providers: [
    {
      provide: PRODUCT_STOCK_CORE_POST_SUBTRACT_PORT,
      useClass: ProductStockCorePostSubtractQueueAdapter,
    } satisfies ClassProvider<IProductStockCorePostSubtractPort>,
  ],
})
export class ProductStockCorePostSubtractQueueModule {}
