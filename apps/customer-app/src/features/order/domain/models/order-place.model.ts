import { OrderAggregate } from '../aggregates/order.aggregate';
import type {
  IOrderPlaceLedgerPayload,
  IOrderPlaceLoggerPayload,
  IOrderPlaceReconstitute,
  IOrderProductReferenceSnapshot,
  IOrderProductSnapshot,
  IOrderProductStockMovement,
} from '../types';

export class OrderPlaceModel extends OrderAggregate {
  private constructor(
    id: string,
    orderProducts: readonly IOrderProductSnapshot[],
    createdAt: Date,
    private readonly customerId: string,
  ) {
    super(id, orderProducts, createdAt);
  }

  public static reconstitute(record: IOrderPlaceReconstitute): OrderPlaceModel {
    const { id, customerId, createdAt, orderProducts } = record;

    return new OrderPlaceModel(id, orderProducts, createdAt, customerId);
  }

  public getProductStockMovements(): IOrderProductStockMovement[] {
    return this.orderProducts.map((orderProduct) => ({
      productId: orderProduct.product.id,
      orderProductId: orderProduct.id,
    }));
  }

  public toLedgerPayload(): IOrderPlaceLedgerPayload {
    return {
      subjectId: this.id,
      occurredAt: this.createdAt.toISOString(),
      payload: {
        customerId: this.customerId,
        orderProducts: this.toOrderProductReferenceSnapshots(),
      },
    };
  }

  public toLoggerPayload(): IOrderPlaceLoggerPayload {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      customerId: this.customerId,
      orderProducts: this.toOrderProductReferenceSnapshots(),
    };
  }

  private toOrderProductReferenceSnapshots(): IOrderProductReferenceSnapshot[] {
    return this.orderProducts.map(({ id, product }) => ({
      id,
      product: { id: product.id },
    }));
  }
}
