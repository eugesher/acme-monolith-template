import type { IOrderProductSnapshot } from './order-product-snapshot.interface';

export interface IOrderPlaceLedgerPayload {
  subjectId: string;
  occurredAt: string;
  payload: {
    customerId: string;
    orderProducts: IOrderProductSnapshot[];
  };
}
