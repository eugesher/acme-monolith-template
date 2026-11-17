import type { ProductStatusEnum } from '@acme-libs/kernel';

export interface IProductUpdateQuery {
  readonly id: string;
  readonly versionAsRead: number;
  readonly name: string;
  readonly status: ProductStatusEnum;
  readonly version: number;
}
