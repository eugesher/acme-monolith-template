import type { DomainEvent } from '@acme-libs/domain';

import type { ProductAggregate } from '../../../domain';

export interface IProductWriteView<TProduct extends ProductAggregate> {
  product: TProduct;
  domainEvents: DomainEvent[];
}
