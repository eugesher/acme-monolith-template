import { Injectable, type ClassProvider } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';

import {
  ORDER_GET_ONE_REPOSITORY_PORT,
  type IOrderGetOneQuery,
  type IOrderGetOneRecord,
  type IOrderGetOneRepositoryPort,
} from '../../../outbound';
import { OrderPersistenceHost } from '../host/order-persistence.host';

@Injectable()
export class OrderGetOneRepository
  extends OrderPersistenceHost
  implements IOrderGetOneRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<IOrderGetOneRepositoryPort> = {
    provide: ORDER_GET_ONE_REPOSITORY_PORT,
    useClass: OrderGetOneRepository,
  };

  public async findOwned(query: IOrderGetOneQuery): Promise<Nullable<IOrderGetOneRecord>> {
    return await this.createOrderBuilder().forOwned(query).getOne();
  }
}
