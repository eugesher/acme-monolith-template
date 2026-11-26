import { Module } from '@nestjs/common';

import { IdempotencyCoreModule } from '@acme-core/modules/idempotency';
import { LedgerCoreModule } from '@acme-core/modules/ledger';
import { ProductStockCoreModule } from '@acme-core/modules/product-stock';

import { ProductStockAddUseCase } from '../application';
import {
  ProductStockAddRepository,
  ProductStockIdempotencyCoreAdapter,
  ProductStockLedgerCoreAdapter,
  ProductStockMovementCoreAdapter,
  ProductStockTransactionAdapter,
} from '../infrastructure';
import { ProductStockController } from './product-stock.controller';

@Module({
  imports: [LedgerCoreModule, IdempotencyCoreModule, ProductStockCoreModule],
  controllers: [ProductStockController],
  providers: [
    ProductStockAddUseCase,
    ProductStockAddRepository.PROVIDER,
    ProductStockIdempotencyCoreAdapter.PROVIDER,
    ProductStockMovementCoreAdapter.PROVIDER,
    ProductStockLedgerCoreAdapter.PROVIDER,
    ProductStockTransactionAdapter.PROVIDER,
  ],
})
export class ProductStockModule {}
