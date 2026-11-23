import { Module } from '@nestjs/common';

import { CatalogProductListUseCase } from '../application';
import {
  CatalogCacheAdapter,
  CatalogConfigCacheTtlMsDefaultProvider,
  CatalogProductListRepository,
} from '../infrastructure';
import { CatalogController } from './catalog.controller';

@Module({
  controllers: [CatalogController],
  providers: [
    CatalogProductListUseCase,
    CatalogProductListRepository.PROVIDER,
    CatalogCacheAdapter.PROVIDER,
    CatalogConfigCacheTtlMsDefaultProvider,
  ],
})
export class CatalogModule {}
