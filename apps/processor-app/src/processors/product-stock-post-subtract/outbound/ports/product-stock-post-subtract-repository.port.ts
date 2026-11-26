import type { IProductStockPostSubtractProductRecord } from '../types';

export interface IProductStockPostSubtractRepositoryPort {
  findActiveMany(productIds: string[]): Promise<IProductStockPostSubtractProductRecord[]>;
}

export const PRODUCT_STOCK_POST_SUBTRACT_REPOSITORY_PORT = Symbol(
  'PRODUCT_STOCK_POST_SUBTRACT_REPOSITORY_PORT',
);
