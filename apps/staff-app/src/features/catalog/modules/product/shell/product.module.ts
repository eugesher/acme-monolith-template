import { Module } from '@nestjs/common';

import { LedgerCoreModule } from '@acme-core/modules/ledger';
import { ProductCoreModule } from '@acme-core/modules/product';
import { TagCommonModule } from '@acme-staff/common/modules';

import {
  ProductAccessService,
  ProductArchiveCase,
  ProductCreateCase,
  ProductGetManyCase,
  ProductGetOneCase,
  ProductGetTagsCase,
  ProductPublishCase,
  ProductReplaceTagsCase,
  ProductUpdateCase,
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
    ProductCreateCase,
    ProductGetManyCase,
    ProductGetOneCase,
    ProductUpdateCase,
    ProductPublishCase,
    ProductArchiveCase,
    ProductGetTagsCase,
    ProductReplaceTagsCase,
    ProductAccessService,
    ProductWriteService,
    ProductAccessRepository.PROVIDER,
    ProductCreateRepository.PROVIDER,
    ProductGetManyRepository.PROVIDER,
    ProductReplaceTagsRepository.PROVIDER,
    ProductWriteRepository.PROVIDER,
    ProductTagCommonAdapter.PROVIDER,
    ProductStatusCoreAdapter.PROVIDER,
    ProductCatalogCacheAdapter.PROVIDER,
    ProductLedgerCoreAdapter.PROVIDER,
    ProductTransactionAdapter.PROVIDER,
    ProductConfigOccRetryAttemptsProvider,
  ],
})
export class ProductModule {}
