import type { ProductStatusEnum } from '@acme-libs/kernel';

export interface IProductCandidate {
  sku: string;
  name: string;
  status: ProductStatusEnum;
  version: number;
}
