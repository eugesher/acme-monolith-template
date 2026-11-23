import { getQueueToken } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';

import { AppNameEnum } from '@acme-libs/kernel';
import { E2EContext } from '@acme-libs/testing';
import { LedgerQueue, ProductStockPostSubtractQueue } from '@acme-core/queues';
import { AppModule } from '@acme-processor/app';
import type { Maybe } from '@acme-libs/toolkit';
import type { ILedgerRecordProcessorPayload } from '@acme-core/contracts/ledger';
import type { IProductStockPostSubtractPayload } from '@acme-core/contracts/product-stock';

interface IAppE2EState {
  ledgerRecordQueue: Queue<ILedgerRecordProcessorPayload>;
  postSubtractQueue: Queue<IProductStockPostSubtractPayload>;
  purgeQueue: Queue;
}

export class AppE2EContext extends E2EContext {
  public get ledgerRecordQueue(): Queue<ILedgerRecordProcessorPayload> {
    return this.started.ledgerRecordQueue;
  }

  public get postSubtractQueue(): Queue<IProductStockPostSubtractPayload> {
    return this.started.postSubtractQueue;
  }

  public get purgeQueue(): Queue {
    return this.started.purgeQueue;
  }

  private static readonly POLL_INTERVAL_MS = 100;
  private static readonly POLL_ATTEMPTS = 100;

  private state: Maybe<IAppE2EState>;

  private get started(): IAppE2EState {
    if (!this.state) {
      throw new Error('AppE2EContext is read before init(): use it inside it() and hooks');
    }

    return this.state;
  }

  constructor() {
    super(AppModule, AppNameEnum.PROCESSOR_APP);
  }

  public override async init(): Promise<void> {
    await super.init();

    const ledgerRecordQueue = this.moduleFixture.get<Queue<ILedgerRecordProcessorPayload>>(
      getQueueToken(LedgerQueue.NAME),
    );
    const postSubtractQueue = this.moduleFixture.get<Queue<IProductStockPostSubtractPayload>>(
      getQueueToken(ProductStockPostSubtractQueue.NAME),
    );
    const purgeQueue = this.moduleFixture.get<Queue>(getQueueToken('idempotency-purge'));

    this.state = { ledgerRecordQueue, postSubtractQueue, purgeQueue };
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

  public async waitForLedgerRecordQueue(): Promise<void> {
    await this.waitFor(`the ${LedgerQueue.NAME} queue to drain`, async () => {
      const counts = await this.ledgerRecordQueue.getJobCounts();

      return counts.waiting + counts.active + counts.delayed === 0;
    });
  }

  public async waitForPostSubtractQueue(): Promise<void> {
    await this.waitFor(`the ${ProductStockPostSubtractQueue.NAME} queue to drain`, async () => {
      const counts = await this.postSubtractQueue.getJobCounts();

      return counts.waiting + counts.active + counts.delayed === 0;
    });
  }
}
