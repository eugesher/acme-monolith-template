import type { IOrderProductReferenceSnapshot } from './order-product-reference-snapshot.interface';

export interface IOrderPlaceLedgerPayload {
  readonly subjectId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly customerId: string;
    readonly orderProducts: readonly IOrderProductReferenceSnapshot[];
  };
}
