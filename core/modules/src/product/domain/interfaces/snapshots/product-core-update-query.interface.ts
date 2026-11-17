import type { ProductStatusEnum } from '@acme-libs/kernel';

export interface IProductCoreUpdateQuery {
  readonly id: string;
  readonly versionAsRead: number;
  readonly status: ProductStatusEnum;
  readonly version: number;
}
