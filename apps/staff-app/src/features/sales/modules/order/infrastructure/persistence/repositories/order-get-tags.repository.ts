import { Injectable, type ClassProvider } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';

import {
  ORDER_GET_TAGS_REPOSITORY_PORT,
  type IOrderGetTagsRecord,
  type IOrderGetTagsRepositoryPort,
} from '../../../outbound';
import { OrderPersistenceHost } from '../host/order-persistence.host';

@Injectable()
export class OrderGetTagsRepository
  extends OrderPersistenceHost
  implements IOrderGetTagsRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<IOrderGetTagsRepositoryPort> = {
    provide: ORDER_GET_TAGS_REPOSITORY_PORT,
    useClass: OrderGetTagsRepository,
  };

  public async findExisting(orderId: string): Promise<Nullable<IOrderGetTagsRecord>> {
    return await this.createOrderBuilder().forExisting(orderId).getOne();
  }
}
