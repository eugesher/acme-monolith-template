import { Module } from '@nestjs/common';

import { LedgerCoreModule } from '@acme-core/modules/ledger';
import { ProductCoreModule } from '@acme-core/modules/product';
import { TagCommonModule } from '@acme-staff/common/modules';

import {
  ProductAccessService,
  ProductArchiveUseCase,
  ProductCreateUseCase,
  ProductGetManyUseCase,
  ProductGetOneUseCase,
  ProductGetTagsUseCase,
  ProductPublishUseCase,
  ProductReplaceTagsUseCase,
  ProductUpdateUseCase,
  ProductWriteService,
} from '../application';
import {
  ProductAccessRepository,
  ProductCatalogCacheAdapter,
  ProductConfigOccRetryAttemptsProvider,
  ProductCreateRepository,
  ProductGetManyRepository,
  ProductLedgerCoreAdapter,
  ProductReplaceTagsRepository,
  ProductStatusCoreAdapter,
  ProductTagCommonAdapter,
  ProductTransactionAdapter,
  ProductWriteRepository,
} from '../infrastructure';
import { ProductController } from './product.controller';

@Module({
  imports: [LedgerCoreModule, TagCommonModule, ProductCoreModule],
  controllers: [ProductController],
  providers: [
    ProductCreateUseCase,
    ProductGetManyUseCase,
    ProductGetOneUseCase,
    ProductUpdateUseCase,
    ProductPublishUseCase,
    ProductArchiveUseCase,
    ProductGetTagsUseCase,
    ProductReplaceTagsUseCase,
    ProductAccessService,
    ProductWriteService,
    ProductAccessRepository.provider,
    ProductCreateRepository.provider,
    ProductGetManyRepository.provider,
    ProductReplaceTagsRepository.provider,
    ProductWriteRepository.provider,
    ProductTagCommonAdapter.provider,
    ProductStatusCoreAdapter.provider,
    ProductCatalogCacheAdapter.provider,
    ProductLedgerCoreAdapter.provider,
    ProductTransactionAdapter.provider,
    ProductConfigOccRetryAttemptsProvider,
  ],
})
export class ProductModule {}
