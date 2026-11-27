import { OrderAggregate } from '../aggregates/order.aggregate';
import type { IOrderReconstitute } from '../types';

export class OrderGetDetailsModel extends OrderAggregate {
  public static reconstitute(record: IOrderReconstitute): OrderGetDetailsModel {
    const { id, createdAt, orderProducts } = record;

    return new OrderGetDetailsModel(id, orderProducts, createdAt);
  }
}
