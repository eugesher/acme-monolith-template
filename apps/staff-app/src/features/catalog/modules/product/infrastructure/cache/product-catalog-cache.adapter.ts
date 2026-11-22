import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import { CACHE_KEYS, CACHE_PORT, type ICachePort } from '@acme-libs/contracts/cache';

import { PRODUCT_CATALOG_CACHE_PORT, type IProductCatalogCachePort } from '../../outbound';

@Injectable()
export class ProductCatalogCacheAdapter implements IProductCatalogCachePort {
  public static readonly provider: ClassProvider<IProductCatalogCachePort> = {
    provide: PRODUCT_CATALOG_CACHE_PORT,
    useClass: ProductCatalogCacheAdapter,
  };

  constructor(
    @Inject(CACHE_PORT)
    private readonly cache: ICachePort,
  ) {}

  public async invalidate(): Promise<void> {
    const prefix = CACHE_KEYS.catalogPrefix();

    await this.cache.handleDelByPrefix(prefix);
  }
}
