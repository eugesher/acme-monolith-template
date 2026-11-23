import type { ICatalogProductListReconstitute, ICatalogProductListSnapshot } from '../types';

export class CatalogProductListModel {
  private constructor(
    private readonly id: string,
    private readonly sku: string,
    private readonly name: string,
  ) {}

  public static toViewData(
    records: ICatalogProductListReconstitute[],
  ): ICatalogProductListSnapshot[] {
    return records.map((record) => {
      const product = CatalogProductListModel.reconstitute(record);

      return product.toSnapshot();
    });
  }

  private static reconstitute(record: ICatalogProductListReconstitute): CatalogProductListModel {
    const { id, sku, name } = record;

    return new CatalogProductListModel(id, sku, name);
  }

  private toSnapshot(): ICatalogProductListSnapshot {
    return { id: this.id, sku: this.sku, name: this.name };
  }
}
