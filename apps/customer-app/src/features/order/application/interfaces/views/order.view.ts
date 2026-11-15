import type { IOrderProductView } from './order-product.view';

export interface IOrderView {
  readonly id: string;
  readonly createdAt: string;
  readonly orderProducts: readonly IOrderProductView[];
}
