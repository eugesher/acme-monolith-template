import type { Order, OrderProduct, Product } from '@acme-core/entities';

export type IOrderGetDetailsRecord = Pick<Order, 'id' | 'createdAt'> & {
  orderProducts: (Pick<OrderProduct, 'id'> & {
    product: Pick<Product, 'id' | 'sku' | 'name'>;
  })[];
};
