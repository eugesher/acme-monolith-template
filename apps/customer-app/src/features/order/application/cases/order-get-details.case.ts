import { Inject, Injectable } from '@nestjs/common';

import { OrderGetDetailsModel, OrderNotFoundException } from '../../domain';
import { ORDER_GET_ONE_REPOSITORY_PORT, type IOrderGetDetailsRepositoryPort } from '../../outbound';
import type { IOrderGetDetailsCommand, IOrderView } from '../types';

@Injectable()
export class OrderGetDetailsCase {
  constructor(
    @Inject(ORDER_GET_ONE_REPOSITORY_PORT)
    private readonly repository: IOrderGetDetailsRepositoryPort,
  ) {}

  public async execute(command: IOrderGetDetailsCommand): Promise<IOrderView> {
    const { customerId, orderId } = command;
    const orderRecord = await this.repository.findOwned({ orderId, customerId });

    if (!orderRecord) {
      throw new OrderNotFoundException(orderId);
    }

    const order = OrderGetDetailsModel.reconstitute(orderRecord);

    return order.toSnapshot();
  }
}
