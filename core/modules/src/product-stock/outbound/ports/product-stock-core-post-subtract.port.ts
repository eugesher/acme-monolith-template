import type { IProductStockCorePostSubtractEnqueueCommand } from '../types';

export interface IProductStockCorePostSubtractPort {
  enqueue(command: IProductStockCorePostSubtractEnqueueCommand): Promise<void>;
}

export const PRODUCT_STOCK_CORE_POST_SUBTRACT_PORT = Symbol(
  'PRODUCT_STOCK_CORE_POST_SUBTRACT_PORT',
);
