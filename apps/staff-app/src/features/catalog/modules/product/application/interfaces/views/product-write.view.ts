import type { DomainEventBase } from '@acme-libs/toolkit';

import type { ProductAggregate } from '../../../domain';

export interface IProductWriteView<TProduct extends ProductAggregate> {
  product: TProduct;
  domainEvents: DomainEventBase[];
}
