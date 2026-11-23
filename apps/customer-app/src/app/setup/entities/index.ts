import type { Type } from '@nestjs/common';

import {
  Customer,
  IdempotencyKey,
  Order,
  OrderProduct,
  Product,
  ProductStock,
} from '@acme-core/entities';

export const entities: Type[] = [
  Customer,
  IdempotencyKey,
  Order,
  OrderProduct,
  Product,
  ProductStock,
];
