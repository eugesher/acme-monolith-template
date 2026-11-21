import { Module } from '@nestjs/common';

import { ProductStockPostSubtractQueueModule } from '@acme-core/queues';
import { PRODUCT_STOCK_CORE_PORT } from '@acme-core/contracts/product-stock';

import { ProductStockCoreLockUseCase, ProductStockCoreMoveUseCase } from '../application';
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
  imports: [ProductStockPostSubtractQueueModule],
  exports: [PRODUCT_STOCK_CORE_PORT],
  providers: [
    { provide: PRODUCT_STOCK_CORE_PORT, useClass: ProductStockCoreFacade },
    ProductStockCoreLockUseCase,
    ProductStockCoreMoveUseCase,
    ProductStockCoreLockRepository.provider,
    ProductStockCoreMoveRepository.provider,
    ProductStockCorePostSubtractQueueAdapter.provider,
    ProductStockCoreTransactionAdapter.provider,
    ProductStockCoreConfigRedisCommandTimeoutMsProvider,
    ProductStockCoreConfigEnqueueRetryAttemptsProvider,
  ],
})
export class ProductStockCoreModule {}
