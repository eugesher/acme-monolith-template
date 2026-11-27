import type { IProductStockPostSubtractProcessProductRecord } from '../types';

export interface IProductStockPostSubtractProcessRepositoryPort {
  findActiveMany(productIds: string[]): Promise<IProductStockPostSubtractProcessProductRecord[]>;
}

export const PRODUCT_STOCK_POST_SUBTRACT_PROCESS_REPOSITORY_PORT = Symbol(
  'PRODUCT_STOCK_POST_SUBTRACT_PROCESS_REPOSITORY_PORT',
);
