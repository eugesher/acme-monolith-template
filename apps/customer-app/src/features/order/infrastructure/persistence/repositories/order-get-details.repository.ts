import { Injectable, type ClassProvider } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';

import {
  ORDER_GET_ONE_REPOSITORY_PORT,
  type IOrderGetDetailsFindOwnedQuery,
  type IOrderGetDetailsRecord,
  type IOrderGetDetailsRepositoryPort,
} from '../../../outbound';
import { OrderPersistenceHost } from '../host/order-persistence.host';

@Injectable()
export class OrderGetDetailsRepository
  extends OrderPersistenceHost
  implements IOrderGetDetailsRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<IOrderGetDetailsRepositoryPort> = {
    provide: ORDER_GET_ONE_REPOSITORY_PORT,
    useClass: OrderGetDetailsRepository,
  };

  public async findOwned(
    query: IOrderGetDetailsFindOwnedQuery,
  ): Promise<Nullable<IOrderGetDetailsRecord>> {
    return await this.createOrderBuilder().forOwned(query).getOne();
  }
}
