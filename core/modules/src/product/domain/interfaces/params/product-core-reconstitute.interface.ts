import type { ProductStatusEnum } from '@acme-libs/kernel';

export interface IProductCoreReconstitute {
  id: string;
  sku: string;
  status: ProductStatusEnum;
  version: number;
}
