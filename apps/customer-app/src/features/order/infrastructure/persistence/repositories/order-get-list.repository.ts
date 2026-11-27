import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  ORDER_GET_MANY_REPOSITORY_PORT,
  type IOrderGetListQuery,
  type IOrderGetListRecord,
  type IOrderGetListRepositoryPort,
} from '../../../outbound';
import { OrderPersistenceHost } from '../host/order-persistence.host';

@Injectable()
export class OrderGetListRepository
  extends OrderPersistenceHost
  implements IOrderGetListRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<IOrderGetListRepositoryPort> = {
    provide: ORDER_GET_MANY_REPOSITORY_PORT,
    useClass: OrderGetListRepository,
  };

  public async list(query: IOrderGetListQuery): Promise<IOrderGetListRecord> {
    return await this.createOrderBuilder().forList(query).getManyAndCount();
  }
}
