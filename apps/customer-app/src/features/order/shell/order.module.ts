import { Module } from '@nestjs/common';

import { IdempotencyCoreModule } from '@acme-core/modules/idempotency';
import { LedgerCoreModule } from '@acme-core/modules/ledger';
import { ProductStockCoreModule } from '@acme-core/modules/product-stock';

import { OrderGetDetailsCase, OrderGetListCase, OrderPlaceCase } from '../application';
import {
  OrderGetDetailsRepository,
  OrderGetListRepository,
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
    OrderGetListCase,
    OrderGetDetailsCase,
    OrderPlaceCase,
    OrderGetListRepository.PROVIDER,
    OrderGetDetailsRepository.PROVIDER,
    OrderPlaceRepository.PROVIDER,
    OrderIdempotencyCoreAdapter.PROVIDER,
    OrderLedgerCoreAdapter.PROVIDER,
    OrderProductStockCoreAdapter.PROVIDER,
    OrderTransactionAdapter.PROVIDER,
  ],
})
export class OrderModule {}
