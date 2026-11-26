import type { Order, OrderProduct, Product } from '@acme-core/entities';

export type IOrderPlaceProductRecord = Pick<Product, 'id'>;

export type IOrderPlaceRecord = Pick<Order, 'id' | 'customerId' | 'createdAt'> & {
  orderProducts: (Pick<OrderProduct, 'id'> & {
    product: Pick<Product, 'id' | 'sku' | 'name'>;
  })[];
};
