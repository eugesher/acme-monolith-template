import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  ORDER_GET_MANY_REPOSITORY_PORT,
  type IOrderGetManyListQuery,
  type IOrderGetManyRecord,
  type IOrderGetManyRepositoryPort,
} from '../../../outbound';
import { OrderPersistenceHost } from '../host/order-persistence.host';

@Injectable()
export class OrderGetManyRepository
  extends OrderPersistenceHost
  implements IOrderGetManyRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<IOrderGetManyRepositoryPort> = {
    provide: ORDER_GET_MANY_REPOSITORY_PORT,
    useClass: OrderGetManyRepository,
  };

  public async list(query: IOrderGetManyListQuery): Promise<IOrderGetManyRecord> {
    return await this.createOrderBuilder().forList(query).getManyAndCount();
  }
}
