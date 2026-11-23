import type { IOrderProductReferenceSnapshot } from './order-product-reference-snapshot.interface';

export interface IOrderPlaceLoggerPayload {
  readonly id: string;
  readonly createdAt: string;
  readonly customerId: string;
  readonly orderProducts: IOrderProductReferenceSnapshot[];
}
