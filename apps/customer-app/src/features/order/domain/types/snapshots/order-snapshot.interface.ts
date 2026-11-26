import type { IOrderProductSnapshot } from './order-product-snapshot.interface';

export interface IOrderSnapshot {
  readonly id: string;
  readonly createdAt: string;
  readonly orderProducts: readonly IOrderProductSnapshot[];
}
