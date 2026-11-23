import type { ProductStatusEnum } from '@acme-libs/kernel';

export interface IProductUpdatePayload {
  readonly id: string;
  readonly versionAsRead: number;
  readonly name: string;
  readonly status: ProductStatusEnum;
  readonly version: number;
}
