import type { IOrderProductSnapshot } from './order-product-snapshot.interface';

export interface IOrderGetOneSnapshot {
  readonly id: string;
  readonly customerId: string;
  readonly createdAt: string;
  readonly orderProducts: readonly IOrderProductSnapshot[];
}
