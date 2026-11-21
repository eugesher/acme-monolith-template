import { Module, type ClassProvider } from '@nestjs/common';

import { LedgerCoreModule } from '@acme-core/modules/ledger';
import { PRODUCT_CORE_PORT, type IProductCorePort } from '@acme-core/contracts/product';

import { ProductCoreArchiveUseCase } from '../application';
import {
  ProductCoreArchiveRepository,
  ProductCoreCatalogCacheAdapter,
  ProductCoreLedgerCoreAdapter,
  ProductCoreTransactionAdapter,
} from '../infrastructure';
import { ProductCoreFacade } from './product-core.facade';

@Module({
  imports: [LedgerCoreModule],
  exports: [PRODUCT_CORE_PORT],
  providers: [
    {
      provide: PRODUCT_CORE_PORT,
      useClass: ProductCoreFacade,
    } satisfies ClassProvider<IProductCorePort>,
    ProductCoreArchiveUseCase,
    ProductCoreArchiveRepository.provider,
    ProductCoreCatalogCacheAdapter.provider,
    ProductCoreLedgerCoreAdapter.provider,
    ProductCoreTransactionAdapter.provider,
  ],
})
export class ProductCoreModule {}
