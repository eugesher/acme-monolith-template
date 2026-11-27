import { Inject, Injectable } from '@nestjs/common';

import { OrderGetOneModel, OrderNotFoundException } from '../../domain';
import { ORDER_GET_ONE_REPOSITORY_PORT, type IOrderGetOneRepositoryPort } from '../../outbound';
import type { IOrderGetOneCommand, IOrderGetOneView } from '../types';

@Injectable()
export class OrderGetOneCase {
  constructor(
    @Inject(ORDER_GET_ONE_REPOSITORY_PORT)
    private readonly repository: IOrderGetOneRepositoryPort,
  ) {}

  public async execute(command: IOrderGetOneCommand): Promise<IOrderGetOneView> {
    const { orderId } = command;
    const orderRecord = await this.repository.findOne(orderId);

    if (!orderRecord) {
      throw new OrderNotFoundException(orderId);
    }

    const order = OrderGetOneModel.reconstitute(orderRecord);

    return order.toSnapshot();
  }
}
