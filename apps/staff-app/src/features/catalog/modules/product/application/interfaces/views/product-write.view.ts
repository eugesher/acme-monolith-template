import type { ProductAggregate } from '../../../domain';

export interface IProductWriteView<TProduct extends ProductAggregate, TAnswer> {
  product: TProduct;
  answer: TAnswer;
}
