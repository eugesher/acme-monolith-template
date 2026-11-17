import type { IOrderGetManyReconstitute, IOrderGetManySnapshot } from '../interfaces';

export class OrderGetManyModel {
  private constructor(
    public readonly id: string,
    public readonly createdAt: Date,
  ) {}

  public static reconstitute(record: IOrderGetManyReconstitute): OrderGetManyModel {
    const { id, createdAt } = record;

    return new OrderGetManyModel(id, createdAt);
  }

  public static toViewData(records: IOrderGetManyReconstitute[]): IOrderGetManySnapshot[] {
    return records.map((record) => {
      const order = OrderGetManyModel.reconstitute(record);

      return order.toSnapshot();
    });
  }

  private toSnapshot(): IOrderGetManySnapshot {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
