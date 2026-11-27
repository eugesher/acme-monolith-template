import { Inject, Injectable } from '@nestjs/common';

import { PaginationHelper } from '@acme-libs/toolkit';

import { OrderGetListModel } from '../../domain';
import { ORDER_GET_MANY_REPOSITORY_PORT, type IOrderGetListRepositoryPort } from '../../outbound';
import type { IOrderGetListCommand, IOrderGetListView } from '../types';

@Injectable()
export class OrderGetListCase {
  constructor(
    @Inject(ORDER_GET_MANY_REPOSITORY_PORT)
    private readonly repository: IOrderGetListRepositoryPort,
  ) {}

  public async execute(command: IOrderGetListCommand): Promise<IOrderGetListView> {
    const { customerId } = command;
    const { limit, offset, page } = PaginationHelper.clampPageWindow({ query: command });
    const [records, total] = await this.repository.list({ limit, offset, customerId });
    const data = OrderGetListModel.toViewData(records);

    return PaginationHelper.toPage({ data, page, limit, total });
  }
}
