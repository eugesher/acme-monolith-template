import type { IOrderProductSnapshot } from './order-product-snapshot.interface';

export interface IOrderPlaceLedgerPayload {
  readonly subjectId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly customerId: string;
    readonly orderProducts: readonly IOrderProductSnapshot[];
  };
}
