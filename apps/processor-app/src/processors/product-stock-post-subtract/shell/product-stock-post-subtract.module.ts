import { Module } from '@nestjs/common';

import { ProductCoreModule } from '@acme-core/modules/product';
import { ProductStockCoreModule } from '@acme-core/modules/product-stock';

import {
  ProductStockPostSubtractReportFailureUseCase,
  ProductStockPostSubtractUseCase,
} from '../application';
import {
  ProductStockPostSubtractArchiveCoreAdapter,
  ProductStockPostSubtractOnHandCoreAdapter,
  ProductStockPostSubtractRepository,
  ProductStockPostSubtractTransactionAdapter,
} from '../infrastructure';
import { ProductStockPostSubtractProcessor } from './product-stock-post-subtract.processor';

@Module({
  imports: [ProductCoreModule, ProductStockCoreModule],
  providers: [
    ProductStockPostSubtractProcessor,
    ProductStockPostSubtractUseCase,
    ProductStockPostSubtractReportFailureUseCase,
    ProductStockPostSubtractRepository.PROVIDER,
    ProductStockPostSubtractOnHandCoreAdapter.PROVIDER,
    ProductStockPostSubtractArchiveCoreAdapter.PROVIDER,
    ProductStockPostSubtractTransactionAdapter.PROVIDER,
  ],
})
export class ProductStockPostSubtractModule {}
