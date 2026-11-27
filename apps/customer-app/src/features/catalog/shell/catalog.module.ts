import { Module } from '@nestjs/common';

import { CatalogGetProductListCase } from '../application';
import {
  CatalogCacheAdapter,
  CatalogConfigCacheTtlMsDefaultProvider,
  CatalogGetProductListRepository,
} from '../infrastructure';
import { CatalogController } from './catalog.controller';

@Module({
  controllers: [CatalogController],
  providers: [
    CatalogGetProductListCase,
    CatalogGetProductListRepository.PROVIDER,
    CatalogCacheAdapter.PROVIDER,
    CatalogConfigCacheTtlMsDefaultProvider,
  ],
})
export class CatalogModule {}
