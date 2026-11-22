import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import { CACHE_KEYS, CACHE_PORT, type ICachePort } from '@acme-libs/contracts/cache';

import {
  CATALOG_CACHE_PORT,
  type ICatalogCachePort,
  type ICatalogCacheProductListReadCommand,
  type ICatalogCacheProductListView,
} from '../../outbound';

@Injectable()
export class CatalogCacheAdapter implements ICatalogCachePort {
  public static readonly provider: ClassProvider<ICatalogCachePort> = {
    provide: CATALOG_CACHE_PORT,
    useClass: CatalogCacheAdapter,
  };

  constructor(
    @Inject(CACHE_PORT)
    private readonly cache: ICachePort,
  ) {}

  public async read(
    command: ICatalogCacheProductListReadCommand,
  ): Promise<ICatalogCacheProductListView> {
    const { page, limit, ttlMs, compute } = command;
    const key = CACHE_KEYS.catalogPage(page, limit);

    return await this.cache.handleWrap({ key, ttlMs, compute });
  }
}
