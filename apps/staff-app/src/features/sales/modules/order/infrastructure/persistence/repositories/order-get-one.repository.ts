import { Injectable, type ClassProvider } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';

import {
  ORDER_GET_ONE_REPOSITORY_PORT,
  type IOrderGetOneRecord,
  type IOrderGetOneRepositoryPort,
} from '../../../outbound';
import { OrderPersistenceHost } from '../host/order-persistence.host';

@Injectable()
export class OrderGetOneRepository
  extends OrderPersistenceHost
  implements IOrderGetOneRepositoryPort
{
  public static readonly provider: ClassProvider<IOrderGetOneRepositoryPort> = {
    provide: ORDER_GET_ONE_REPOSITORY_PORT,
    useClass: OrderGetOneRepository,
  };

  public async findById(orderId: string): Promise<Nullable<IOrderGetOneRecord>> {
    return await this.createOrderBuilder().forById(orderId).getOne();
  }
}
