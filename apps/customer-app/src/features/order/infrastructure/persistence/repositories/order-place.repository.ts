import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  ORDER_PLACE_REPOSITORY_PORT,
  type IOrderPlaceInsertQuery,
  type IOrderPlaceOrderProductInsertQuery,
  type IOrderPlaceProductRecord,
  type IOrderPlaceRecord,
  type IOrderPlaceRepositoryPort,
} from '../../../outbound';
import { OrderPersistenceHost } from '../host/order-persistence.host';

@Injectable()
export class OrderPlaceRepository
  extends OrderPersistenceHost
  implements IOrderPlaceRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<IOrderPlaceRepositoryPort> = {
    provide: ORDER_PLACE_REPOSITORY_PORT,
    useClass: OrderPlaceRepository,
  };

  public async findActiveMany(productIds: readonly string[]): Promise<IOrderPlaceProductRecord[]> {
    if (productIds.length === 0) {
      return [];
    }

    return await this.createProductBuilder().forActiveMany(productIds).getMany();
  }

  public async insertOrder(query: IOrderPlaceInsertQuery): Promise<string> {
    return await this.orderRepository.insertOne(query);
  }

  public async insertOrderProducts(queries: IOrderPlaceOrderProductInsertQuery[]): Promise<void> {
    await this.orderProductRepository.insert(queries);
  }

  public async findPlaced(orderId: string): Promise<IOrderPlaceRecord> {
    return await this.createOrderBuilder().forPlaced(orderId).getOneOrFail();
  }
}
