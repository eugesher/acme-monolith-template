import { Module } from '@nestjs/common';

import { ProductCoreModule } from '@acme-core/modules/product';
import { ProductStockCoreModule } from '@acme-core/modules/product-stock';

import {
  ProductStockPostSubtractProcessCase,
  ProductStockPostSubtractReportWorkerFailedCase,
} from '../application';
import {
  ProductStockPostSubtractArchiveCoreAdapter,
  ProductStockPostSubtractOnHandCoreAdapter,
  ProductStockPostSubtractProcessRepository,
  ProductStockPostSubtractTransactionAdapter,
} from '../infrastructure';
import { ProductStockPostSubtractProcessor } from './product-stock-post-subtract.processor';

@Module({
  imports: [ProductCoreModule, ProductStockCoreModule],
  providers: [
    ProductStockPostSubtractProcessor,
    ProductStockPostSubtractProcessCase,
    ProductStockPostSubtractReportWorkerFailedCase,
    ProductStockPostSubtractProcessRepository.PROVIDER,
    ProductStockPostSubtractOnHandCoreAdapter.PROVIDER,
    ProductStockPostSubtractArchiveCoreAdapter.PROVIDER,
    ProductStockPostSubtractTransactionAdapter.PROVIDER,
  ],
})
export class ProductStockPostSubtractModule {}
