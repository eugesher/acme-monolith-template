import { ProductAggregate } from '../aggregates/product.aggregate';
import type { IProductReconstitute } from '../types';

export class ProductGetOneModel extends ProductAggregate {
  public static reconstitute(this: void, record: IProductReconstitute): ProductGetOneModel {
    return new ProductGetOneModel(record);
  }
}
