import { getQueueToken } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';

import { AppNameEnum } from '@acme-libs/kernel';
import { E2EContext } from '@acme-libs/testing';
import { LedgerAppendQueue, ProductStockPostSubtractQueue } from '@acme-core/queues';
import { AppModule } from '@acme-processor/app';
import type { Maybe } from '@acme-libs/toolkit';
import type { ILedgerAppendProcessorPayload } from '@acme-core/contracts/ledger';
import type { IProductStockPostSubtractPayload } from '@acme-core/contracts/product-stock';

interface IAppE2EState {
  ledgerAppendQueue: Queue<ILedgerAppendProcessorPayload>;
  productStockPostSubtractQueue: Queue<IProductStockPostSubtractPayload>;
  idempotencyPurgeQueue: Queue;
}

export class AppE2EContext extends E2EContext {
  public get ledgerAppendQueue(): Queue<ILedgerAppendProcessorPayload> {
    return this.appE2EState.ledgerAppendQueue;
  }

  public get productStockPostSubtractQueue(): Queue<IProductStockPostSubtractPayload> {
    return this.appE2EState.productStockPostSubtractQueue;
  }

  public get idempotencyPurgeQueue(): Queue {
    return this.appE2EState.idempotencyPurgeQueue;
  }

  private static readonly POLL_INTERVAL_MS = 100;
  private static readonly POLL_ATTEMPTS = 100;

  private _appE2EState: Maybe<IAppE2EState>;

  private get appE2EState(): IAppE2EState {
    if (!this._appE2EState) {
      throw new Error('AppE2EContext is read before init(): use it inside it() and hooks');
    }

    return this._appE2EState;
  }

  constructor() {
    super(AppModule, AppNameEnum.PROCESSOR_APP);
  }

  public override async init(): Promise<void> {
    await super.init();

    const ledgerAppendQueue = this.moduleFixture.get<Queue<ILedgerAppendProcessorPayload>>(
      getQueueToken(LedgerAppendQueue.NAME),
    );
    const productStockPostSubtractQueue = this.moduleFixture.get<
      Queue<IProductStockPostSubtractPayload>
    >(getQueueToken(ProductStockPostSubtractQueue.NAME));
    const idempotencyPurgeQueue = this.moduleFixture.get<Queue>(getQueueToken('idempotency-purge'));

    this._appE2EState = { ledgerAppendQueue, productStockPostSubtractQueue, idempotencyPurgeQueue };
  }

  public async waitFor(description: string, settled: () => Promise<boolean>): Promise<void> {
    for (let attempt = 1; attempt <= AppE2EContext.POLL_ATTEMPTS; attempt++) {
      if (await settled()) {
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, AppE2EContext.POLL_INTERVAL_MS));
    }

    throw new Error(`Timed out waiting for ${description}`);
  }

  public async waitForLedgerAppendQueue(): Promise<void> {
    await this.waitFor(`the ${LedgerAppendQueue.NAME} queue to drain`, async () => {
      const counts = await this.ledgerAppendQueue.getJobCounts();

      return counts.waiting + counts.active + counts.delayed === 0;
    });
  }

  public async waitForPostSubtractQueue(): Promise<void> {
    await this.waitFor(`the ${ProductStockPostSubtractQueue.NAME} queue to drain`, async () => {
      const counts = await this.productStockPostSubtractQueue.getJobCounts();

      return counts.waiting + counts.active + counts.delayed === 0;
    });
  }
}
