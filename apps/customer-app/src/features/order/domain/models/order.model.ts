import { AggregateRootBase } from '@acme-libs/toolkit';

import type {
  IOrderProductSnapshot,
  IOrderProductStockMovement,
  IOrderReconstitute,
  IOrderSnapshot,
} from '../interfaces';

export class OrderModel extends AggregateRootBase<string> {
  private constructor(
    id: string,
    public readonly orderProducts: readonly IOrderProductSnapshot[],
    public readonly createdAt: Date,
  ) {
    super(id);
  }

  public static reconstitute(record: IOrderReconstitute): OrderModel {
    const { id, createdAt, orderProducts } = record;

    return new OrderModel(id, orderProducts, createdAt);
  }

  public getProductStockMovements(): IOrderProductStockMovement[] {
    return this.orderProducts.map((orderProduct) => ({
      productId: orderProduct.productId,
      orderProductId: orderProduct.id,
    }));
  }

  public toSnapshot(): IOrderSnapshot {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      orderProducts: [...this.orderProducts],
    };
  }
}
