import type { IOrderGetManyReconstitute, IOrderGetManySnapshot } from '../interfaces';

export class OrderGetManyModel {
  private constructor(
    private readonly id: string,
    private readonly createdAt: Date,
  ) {}

  public static toViewData(records: IOrderGetManyReconstitute[]): IOrderGetManySnapshot[] {
    return records.map((record) => {
      const order = OrderGetManyModel.reconstitute(record);

      return order.toSnapshot();
    });
  }

  private static reconstitute(record: IOrderGetManyReconstitute): OrderGetManyModel {
    const { id, createdAt } = record;

    return new OrderGetManyModel(id, createdAt);
  }

  private toSnapshot(): IOrderGetManySnapshot {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
