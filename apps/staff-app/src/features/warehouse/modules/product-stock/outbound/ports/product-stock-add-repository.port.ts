import type { Nullable } from '@acme-libs/toolkit';

import type { IProductStockAddProductRecord } from '../types';

export interface IProductStockAddRepositoryPort {
  findOne(productId: string): Promise<Nullable<IProductStockAddProductRecord>>;
}

export const PRODUCT_STOCK_ADD_REPOSITORY_PORT = Symbol('PRODUCT_STOCK_ADD_REPOSITORY_PORT');
