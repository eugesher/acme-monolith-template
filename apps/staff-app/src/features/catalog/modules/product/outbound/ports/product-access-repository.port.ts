import type { Nullable } from '@acme-libs/toolkit';

import type { IProductAccessRecord } from '../types';

export interface IProductAccessRepositoryPort {
  findOne(productId: string): Promise<Nullable<IProductAccessRecord>>;
}

export const PRODUCT_ACCESS_REPOSITORY_PORT = Symbol('PRODUCT_ACCESS_REPOSITORY_PORT');
