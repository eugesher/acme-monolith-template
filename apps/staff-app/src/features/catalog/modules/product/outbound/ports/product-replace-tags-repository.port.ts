import type { Nullable } from '@acme-libs/toolkit';

import type { IProductReplaceTagsRecord } from '../types';

export interface IProductReplaceTagsRepositoryPort {
  lockOne(productId: string): Promise<Nullable<IProductReplaceTagsRecord>>;
}

export const PRODUCT_REPLACE_TAGS_REPOSITORY_PORT = Symbol('PRODUCT_REPLACE_TAGS_REPOSITORY_PORT');
