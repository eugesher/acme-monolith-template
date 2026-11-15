import type { IOrderProductSnapshot } from './order-product-snapshot.interface';

export interface IOrderPlaceLoggerPayload {
  readonly id: string;
  readonly createdAt: string;
  readonly customerId: string;
  readonly orderProducts: readonly IOrderProductSnapshot[];
}
