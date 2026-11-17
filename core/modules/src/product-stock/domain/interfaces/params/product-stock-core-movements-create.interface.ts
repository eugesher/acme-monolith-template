import type { Nullable } from '@acme-libs/toolkit';

export interface IProductStockCoreMovementsCreate {
  sign: number;
  movements: {
    productId: string;
    quantity: number;
    orderProductId: Nullable<string>;
  }[];
}
