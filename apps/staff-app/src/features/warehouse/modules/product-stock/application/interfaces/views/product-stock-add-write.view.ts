import type { DomainEvent } from '@acme-libs/domain';

import type { IProductStockAddView } from './product-stock-add.view';

export interface IProductStockAddWriteView {
  stockOnHand: IProductStockAddView;
  productStockId: string;
  domainEvents: DomainEvent[];
}
