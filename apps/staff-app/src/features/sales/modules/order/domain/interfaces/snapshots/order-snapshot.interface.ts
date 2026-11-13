import type { IOrderProductSnapshot } from './order-product-snapshot.interface';

export interface IOrderSnapshot {
  id: string;
  customerId: string;
  createdAt: string;
  products: IOrderProductSnapshot[];
}
