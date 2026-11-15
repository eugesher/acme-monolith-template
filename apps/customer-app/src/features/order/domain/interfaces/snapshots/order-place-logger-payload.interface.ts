import type { IOrderProductSnapshot } from './order-product-snapshot.interface';

export interface IOrderPlaceLoggerPayload {
  id: string;
  createdAt: string;
  customerId: string;
  orderProducts: IOrderProductSnapshot[];
}
