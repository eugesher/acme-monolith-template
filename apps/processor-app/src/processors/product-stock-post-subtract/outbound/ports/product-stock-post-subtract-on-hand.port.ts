import type {
  IProductStockPostSubtractOnHandLockCommand,
  IProductStockPostSubtractOnHandView,
} from '../interfaces';

export interface IProductStockPostSubtractOnHandPort {
  lock(
    command: IProductStockPostSubtractOnHandLockCommand,
  ): Promise<IProductStockPostSubtractOnHandView[]>;
}

export const PRODUCT_STOCK_POST_SUBTRACT_ON_HAND_PORT = Symbol(
  'PRODUCT_STOCK_POST_SUBTRACT_ON_HAND_PORT',
);
