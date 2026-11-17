import type { ProductStatusEnum } from '@acme-libs/kernel';

import type { IProductGetManyReconstitute, IProductGetManySnapshot } from '../interfaces';

export class ProductGetManyModel {
  private constructor(
    private readonly id: string,
    private readonly sku: string,
    private readonly name: string,
    private readonly status: ProductStatusEnum,
    private readonly version: number,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  public static toViewData(records: IProductGetManyReconstitute[]): IProductGetManySnapshot[] {
    return records.map((record) => {
      const product = ProductGetManyModel.reconstitute(record);

      return product.toSnapshot();
    });
  }

  private static reconstitute(record: IProductGetManyReconstitute): ProductGetManyModel {
    const { id, sku, name, status, version, createdAt, updatedAt } = record;

    return new ProductGetManyModel(id, sku, name, status, version, createdAt, updatedAt);
  }

  private toSnapshot(): IProductGetManySnapshot {
    return {
      id: this.id,
      sku: this.sku,
      name: this.name,
      status: this.status,
      version: this.version,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
