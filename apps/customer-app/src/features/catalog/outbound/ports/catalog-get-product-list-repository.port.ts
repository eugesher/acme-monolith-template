import type { ICatalogGetProductListQuery, ICatalogGetProductListRecord } from '../types';

export interface ICatalogGetProductListRepositoryPort {
  list(query: ICatalogGetProductListQuery): Promise<ICatalogGetProductListRecord>;
}

export const CATALOG_PRODUCT_LIST_REPOSITORY_PORT = Symbol('CATALOG_PRODUCT_LIST_REPOSITORY_PORT');
