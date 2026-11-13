import type { IOrderProductSnapshot, IOrderReconstitute, IOrderSnapshot } from '../interfaces';

export class OrderModel {
  private constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly orderProducts: readonly IOrderProductSnapshot[],
    public readonly createdAt: Date,
  ) {}

  public static reconstitute(record: IOrderReconstitute): OrderModel {
    const { id, customerId, createdAt, orderProducts } = record;

    return new OrderModel(id, customerId, orderProducts, createdAt);
  }

  public toSnapshot(): IOrderSnapshot {
    return {
      id: this.id,
      customerId: this.customerId,
      createdAt: this.createdAt.toISOString(),
      orderProducts: [...this.orderProducts],
    };
  }
}
