import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, type ClassProvider } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { DeadlineHelper } from '@acme-libs/toolkit';
import { ProductStockPostSubtractQueue } from '@acme-core/queues';
import type { IProductStockPostSubtractPayload } from '@acme-core/contracts/product-stock';

import {
  PRODUCT_STOCK_CORE_POST_SUBTRACT_PORT,
  type IProductStockCorePostSubtractEnqueueCommand,
  type IProductStockCorePostSubtractPort,
} from '../../outbound';

@Injectable()
export class ProductStockCorePostSubtractQueueAdapter implements IProductStockCorePostSubtractPort {
  public static readonly PROVIDER: ClassProvider<IProductStockCorePostSubtractPort> = {
    provide: PRODUCT_STOCK_CORE_POST_SUBTRACT_PORT,
    useClass: ProductStockCorePostSubtractQueueAdapter,
  };

  constructor(
    @InjectQueue(ProductStockPostSubtractQueue.NAME)
    private readonly queue: Queue<IProductStockPostSubtractPayload>,
  ) {}

  public async enqueue(command: IProductStockCorePostSubtractEnqueueCommand): Promise<void> {
    const { productIds, correlationId, timeoutMs } = command;

    await DeadlineHelper.race(
      () => this.queue.add(ProductStockPostSubtractQueue.NAME, { productIds, correlationId }),
      { timeoutMs, message: `Enqueue timed out after ${timeoutMs} ms` },
    );
  }
}
