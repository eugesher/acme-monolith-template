import { AggregateRootBase } from '@acme-libs/toolkit';

import type {
  IOrderPlaceLedgerPayload,
  IOrderPlaceLoggerPayload,
  IOrderProductSnapshot,
  IOrderProductStockMovement,
  IOrderReconstitute,
  IOrderSnapshot,
} from '../interfaces';

export class OrderModel extends AggregateRootBase<string> {
  private constructor(
    id: string,
    public readonly customerId: string,
    public readonly orderProducts: readonly IOrderProductSnapshot[],
    public readonly createdAt: Date,
  ) {
    super(id);
  }

  public static reconstitute(record: IOrderReconstitute): OrderModel {
    const { id, customerId, createdAt, orderProducts } = record;

    return new OrderModel(id, customerId, orderProducts, createdAt);
  }

  public getProductStockMovements(): IOrderProductStockMovement[] {
    return this.orderProducts.map((orderProduct) => ({
      productId: orderProduct.productId,
      orderProductId: orderProduct.id,
    }));
  }

  public toLedgerPayload(): IOrderPlaceLedgerPayload {
    return {
      subjectId: this.id,
      occurredAt: this.createdAt.toISOString(),
      payload: {
        customerId: this.customerId,
        orderProducts: this.orderProducts,
      },
    };
  }

  public toLoggerPayload(): IOrderPlaceLoggerPayload {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      customerId: this.customerId,
      orderProducts: this.orderProducts,
    };
  }

  public toSnapshot(): IOrderSnapshot {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      orderProducts: this.orderProducts,
    };
  }
}
