import type { ProductStatusEnum } from '@acme-libs/kernel';

export interface IProductCoreArchiveReconstitute {
  id: string;
  sku: string;
  status: ProductStatusEnum;
  version: number;
  updatedAt: Date;
}
