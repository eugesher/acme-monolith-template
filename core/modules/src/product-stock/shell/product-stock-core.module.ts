import { Module, type ClassProvider } from '@nestjs/common';

import { ProductStockPostSubtractQueue } from '@acme-core/queues';
import {
  PRODUCT_STOCK_CORE_PORT,
  type IProductStockCorePort,
} from '@acme-core/contracts/product-stock';

import { ProductStockCoreLockCase, ProductStockCoreMoveCase } from '../application';
import {
  ProductStockCoreConfigEnqueueRetryAttemptsProvider,
  ProductStockCoreConfigRedisCommandTimeoutMsProvider,
  ProductStockCoreLockRepository,
  ProductStockCoreMoveRepository,
  ProductStockCorePostSubtractQueueAdapter,
  ProductStockCoreTransactionAdapter,
} from '../infrastructure';
import { ProductStockCoreFacade } from './product-stock-core.facade';

@Module({
  imports: [ProductStockPostSubtractQueue.register()],
  exports: [PRODUCT_STOCK_CORE_PORT],
  providers: [
    {
      provide: PRODUCT_STOCK_CORE_PORT,
      useClass: ProductStockCoreFacade,
    } satisfies ClassProvider<IProductStockCorePort>,
    ProductStockCoreLockCase,
    ProductStockCoreMoveCase,
    ProductStockCoreLockRepository.PROVIDER,
    ProductStockCoreMoveRepository.PROVIDER,
    ProductStockCorePostSubtractQueueAdapter.PROVIDER,
    ProductStockCoreTransactionAdapter.PROVIDER,
    ProductStockCoreConfigRedisCommandTimeoutMsProvider,
    ProductStockCoreConfigEnqueueRetryAttemptsProvider,
  ],
})
export class ProductStockCoreModule {}
