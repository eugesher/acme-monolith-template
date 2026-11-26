import type { ICatalogCacheProductListReadCommand, ICatalogCacheProductListView } from '../types';

export interface ICatalogCachePort {
  read(command: ICatalogCacheProductListReadCommand): Promise<ICatalogCacheProductListView>;
}

export const CATALOG_CACHE_PORT = Symbol('CATALOG_CACHE_PORT');
