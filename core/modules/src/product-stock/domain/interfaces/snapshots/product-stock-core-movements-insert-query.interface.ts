import type { Nullable } from '@acme-libs/toolkit';

export interface IProductStockCoreMovementsInsertQuery {
  readonly productId: string;
  readonly quantity: number;
  readonly orderProductId: Nullable<string>;
}
