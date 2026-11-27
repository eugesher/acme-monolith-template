import { Module } from '@nestjs/common';

import { CatalogProductListCase } from '../application';
import {
  CatalogCacheAdapter,
  CatalogConfigCacheTtlMsDefaultProvider,
  CatalogProductListRepository,
} from '../infrastructure';
import { CatalogController } from './catalog.controller';

@Module({
  controllers: [CatalogController],
  providers: [
    CatalogProductListCase,
    CatalogProductListRepository.PROVIDER,
    CatalogCacheAdapter.PROVIDER,
    CatalogConfigCacheTtlMsDefaultProvider,
  ],
})
export class CatalogModule {}
