import type { Nullable } from '@acme-libs/toolkit';

export interface IProductStockCoreMovementsInsertPayload {
  readonly productId: string;
  readonly quantity: number;
  readonly orderProductId: Nullable<string>;
}
