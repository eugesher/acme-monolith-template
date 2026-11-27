import type { Product } from '@acme-core/entities';

export type ICatalogGetProductListRecordItem = Pick<Product, 'id' | 'sku' | 'name'>;

export type ICatalogGetProductListRecord = [ICatalogGetProductListRecordItem[], number];
