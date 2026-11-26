import type { IOrderGetManyReconstitute, IOrderGetManySnapshot } from '../types';

export class OrderGetManyModel {
  private constructor(
    private readonly id: string,
    private readonly customerId: string,
    private readonly createdAt: Date,
  ) {}

  public static toViewData(records: IOrderGetManyReconstitute[]): IOrderGetManySnapshot[] {
    return records.map((record) => {
      const order = OrderGetManyModel.reconstitute(record);

      return order.toSnapshot();
    });
  }

  private static reconstitute(record: IOrderGetManyReconstitute): OrderGetManyModel {
    const { id, customerId, createdAt } = record;

    return new OrderGetManyModel(id, customerId, createdAt);
  }

  private toSnapshot(): IOrderGetManySnapshot {
    return {
      id: this.id,
      customerId: this.customerId,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
