import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { DeadlineHelper } from '@acme-libs/toolkit';
import {
  PRODUCT_STOCK_POST_SUBTRACT_QUEUE,
  type IProductStockPostSubtractPayload,
} from '@acme-core/contracts/product-stock';

import type {
  IProductStockCorePostSubtractEnqueueCommand,
  IProductStockCorePostSubtractPort,
} from '../../outbound';

@Injectable()
export class ProductStockCorePostSubtractQueueAdapter implements IProductStockCorePostSubtractPort {
  constructor(
    @InjectQueue(PRODUCT_STOCK_POST_SUBTRACT_QUEUE)
    private readonly queue: Queue<IProductStockPostSubtractPayload>,
  ) {}

  public async enqueue(command: IProductStockCorePostSubtractEnqueueCommand): Promise<void> {
    const { productIds, correlationId, timeoutMs } = command;

    await DeadlineHelper.race(
      () => this.queue.add(PRODUCT_STOCK_POST_SUBTRACT_QUEUE, { productIds, correlationId }),
      { timeoutMs, message: `Enqueue timed out after ${timeoutMs} ms` },
    );
  }
}
