import type { ProductStatusEnum } from '@acme-libs/kernel';

export interface IProductReconstitute {
  id: string;
  sku: string;
  name: string;
  status: ProductStatusEnum;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
