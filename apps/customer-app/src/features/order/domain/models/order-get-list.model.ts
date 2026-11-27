import type { IOrderGetListReconstitute, IOrderGetListSnapshot } from '../types';

export class OrderGetListModel {
  private constructor(
    private readonly id: string,
    private readonly createdAt: Date,
  ) {}

  public static toViewData(records: IOrderGetListReconstitute[]): IOrderGetListSnapshot[] {
    return records.map((record) => {
      const order = OrderGetListModel.reconstitute(record);

      return order.toSnapshot();
    });
  }

  private static reconstitute(record: IOrderGetListReconstitute): OrderGetListModel {
    const { id, createdAt } = record;

    return new OrderGetListModel(id, createdAt);
  }

  private toSnapshot(): IOrderGetListSnapshot {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
