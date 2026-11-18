import { ProductAggregate } from '../aggregates/product.aggregate';
import type {
  IProductReconstitute,
  IProductUpdate,
  IProductUpdateLoggerPayload,
} from '../interfaces';

export class ProductUpdateModel extends ProductAggregate {
  public static reconstitute(this: void, record: IProductReconstitute): ProductUpdateModel {
    return new ProductUpdateModel(record);
  }

  public update(changes: IProductUpdate): void {
    const { name } = changes;

    if (name === undefined) {
      return;
    }

    const validName = ProductUpdateModel.validName(name);

    if (validName === this.currentName) {
      return;
    }

    this.currentName = validName;
    this.bumpVersion();
  }

  public toLoggerPayload(): IProductUpdateLoggerPayload {
    return { id: this.id, version: this.version };
  }
}
