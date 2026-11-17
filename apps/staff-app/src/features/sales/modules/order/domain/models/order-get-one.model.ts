import type {
  IOrderGetOneReconstitute,
  IOrderGetOneSnapshot,
  IOrderProductSnapshot,
} from '../interfaces';

export class OrderGetOneModel {
  private constructor(
    private readonly id: string,
    private readonly customerId: string,
    private readonly orderProducts: readonly IOrderProductSnapshot[],
    private readonly createdAt: Date,
  ) {}

  public static reconstitute(record: IOrderGetOneReconstitute): OrderGetOneModel {
    const { id, customerId, createdAt, orderProducts } = record;

    return new OrderGetOneModel(id, customerId, orderProducts, createdAt);
  }

  public toSnapshot(): IOrderGetOneSnapshot {
    return {
      id: this.id,
      customerId: this.customerId,
      createdAt: this.createdAt.toISOString(),
      orderProducts: this.orderProducts,
    };
  }
}
