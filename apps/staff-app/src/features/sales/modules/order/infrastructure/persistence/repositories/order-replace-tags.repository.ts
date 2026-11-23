import { Injectable, type ClassProvider } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';

import {
  ORDER_REPLACE_TAGS_REPOSITORY_PORT,
  type IOrderReplaceTagsRecord,
  type IOrderReplaceTagsRepositoryPort,
} from '../../../outbound';
import { OrderPersistenceHost } from '../host/order-persistence.host';

@Injectable()
export class OrderReplaceTagsRepository
  extends OrderPersistenceHost
  implements IOrderReplaceTagsRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<IOrderReplaceTagsRepositoryPort> = {
    provide: ORDER_REPLACE_TAGS_REPOSITORY_PORT,
    useClass: OrderReplaceTagsRepository,
  };

  public async lockById(orderId: string): Promise<Nullable<IOrderReplaceTagsRecord>> {
    return await this.createOrderBuilder().forLockById(orderId).getOne();
  }
}
