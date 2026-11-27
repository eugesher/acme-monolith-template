import { Module } from '@nestjs/common';

import { IdempotencyCoreModule } from '@acme-core/modules/idempotency';
import { LedgerCoreModule } from '@acme-core/modules/ledger';
import { ProductStockCoreModule } from '@acme-core/modules/product-stock';

import { OrderGetManyCase, OrderGetOneCase, OrderPlaceCase } from '../application';
import {
  OrderGetManyRepository,
  OrderGetOneRepository,
  OrderIdempotencyCoreAdapter,
  OrderLedgerCoreAdapter,
  OrderPlaceRepository,
  OrderProductStockCoreAdapter,
  OrderTransactionAdapter,
} from '../infrastructure';
import { OrderController } from './order.controller';

@Module({
  imports: [LedgerCoreModule, IdempotencyCoreModule, ProductStockCoreModule],
  controllers: [OrderController],
  providers: [
    OrderGetManyCase,
    OrderGetOneCase,
    OrderPlaceCase,
    OrderGetManyRepository.PROVIDER,
    OrderGetOneRepository.PROVIDER,
    OrderPlaceRepository.PROVIDER,
    OrderIdempotencyCoreAdapter.PROVIDER,
    OrderLedgerCoreAdapter.PROVIDER,
    OrderProductStockCoreAdapter.PROVIDER,
    OrderTransactionAdapter.PROVIDER,
  ],
})
export class OrderModule {}
