import type { Product, ProductStock } from '@acme-core/entities';

export type IProductStockCoreMoveProductRecord = Pick<Product, 'id'>;

export type IProductStockCoreMoveInsertRecord = Pick<ProductStock, 'id' | 'createdAt'>;

export interface IProductStockCoreMoveSumRecord {
  productId: string;
  quantity: number;
}
