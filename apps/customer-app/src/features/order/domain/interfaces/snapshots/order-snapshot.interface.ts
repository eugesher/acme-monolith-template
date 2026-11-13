import type { IOrderProductSnapshot } from './order-product-snapshot.interface';

export interface IOrderSnapshot {
  id: string;
  createdAt: string;
  orderProducts: IOrderProductSnapshot[];
}
