import { Inject, Injectable } from '@nestjs/common';

import { OrderGetOneModel, OrderNotFoundException } from '../../domain';
import { ORDER_GET_ONE_REPOSITORY_PORT, type IOrderGetOneRepositoryPort } from '../../outbound';
import type { IOrderGetOneCommand, IOrderView } from '../types';

@Injectable()
export class OrderGetOneUseCase {
  constructor(
    @Inject(ORDER_GET_ONE_REPOSITORY_PORT)
    private readonly repository: IOrderGetOneRepositoryPort,
  ) {}

  public async execute(command: IOrderGetOneCommand): Promise<IOrderView> {
    const { customerId, orderId } = command;
    const orderRecord = await this.repository.findOwned({ orderId, customerId });

    if (!orderRecord) {
      throw new OrderNotFoundException(orderId);
    }

    const order = OrderGetOneModel.reconstitute(orderRecord);

    return order.toSnapshot();
  }
}
