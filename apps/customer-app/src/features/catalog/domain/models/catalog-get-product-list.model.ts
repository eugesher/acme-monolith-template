import type { ICatalogGetProductListReconstitute, ICatalogGetProductListSnapshot } from '../types';

export class CatalogGetProductListModel {
  private constructor(
    private readonly id: string,
    private readonly sku: string,
    private readonly name: string,
  ) {}

  public static toViewData(
    records: ICatalogGetProductListReconstitute[],
  ): ICatalogGetProductListSnapshot[] {
    return records.map((record) => {
      const product = CatalogGetProductListModel.reconstitute(record);

      return product.toSnapshot();
    });
  }

  private static reconstitute(
    record: ICatalogGetProductListReconstitute,
  ): CatalogGetProductListModel {
    const { id, sku, name } = record;

    return new CatalogGetProductListModel(id, sku, name);
  }

  private toSnapshot(): ICatalogGetProductListSnapshot {
    return { id: this.id, sku: this.sku, name: this.name };
  }
}
