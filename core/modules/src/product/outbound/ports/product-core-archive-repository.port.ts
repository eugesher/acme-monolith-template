import type { Nullable } from '@acme-libs/toolkit';

import type { IProductCoreArchiveRecord, IProductCoreArchiveUpdateQuery } from '../types';

export interface IProductCoreArchiveRepositoryPort {
  lockById(productId: string): Promise<Nullable<IProductCoreArchiveRecord>>;
  update(query: IProductCoreArchiveUpdateQuery): Promise<void>;
  findById(productId: string): Promise<IProductCoreArchiveRecord>;
}

export const PRODUCT_CORE_ARCHIVE_REPOSITORY_PORT = Symbol('PRODUCT_CORE_ARCHIVE_REPOSITORY_PORT');
