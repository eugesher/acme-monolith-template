import type { IProductStockCoreOnHandView } from './product-stock-core-on-hand.view';

export interface IProductStockCoreMoveView {
  productStocks: {
    id: string;
    createdAt: string;
  }[];
  stock: IProductStockCoreOnHandView[];
}
