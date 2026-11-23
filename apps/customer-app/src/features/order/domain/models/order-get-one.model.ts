import { OrderAggregate } from '../aggregates/order.aggregate';
import type { IOrderReconstitute } from '../types';

export class OrderGetOneModel extends OrderAggregate {
  public static reconstitute(record: IOrderReconstitute): OrderGetOneModel {
    const { id, createdAt, orderProducts } = record;

    return new OrderGetOneModel(id, orderProducts, createdAt);
  }
}
