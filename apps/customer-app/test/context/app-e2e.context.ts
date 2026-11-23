import { getQueueToken } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';
import type { Redis } from 'ioredis';

import { AppNameEnum, AuthAudienceEnum } from '@acme-libs/kernel';
import { CACHE_REDIS_CLIENT_TOKEN } from '@acme-libs/testing';
import { AuthE2EContext } from '@acme-libs/testing';
import { LedgerQueue, ProductStockPostSubtractQueue } from '@acme-core/queues';
import { AppModule } from '@acme-customer/app';
import type { Maybe } from '@acme-libs/toolkit';
import type { ILedgerRecordProcessorPayload } from '@acme-core/contracts/ledger';
import type { IProductStockPostSubtractPayload } from '@acme-core/contracts/product-stock';

interface IAppE2EState {
  redis: Redis;
  annToken: string;
  bobToken: string;
  carolToken: string;
}

export class AppE2EContext extends AuthE2EContext {
  public get redis(): Redis {
    return this.started.redis;
  }

  public get annToken(): string {
    return this.started.annToken;
  }

  public get bobToken(): string {
    return this.started.bobToken;
  }

  public get carolToken(): string {
    return this.started.carolToken;
  }

  private state: Maybe<IAppE2EState>;

  private get started(): IAppE2EState {
    if (!this.state) {
      throw new Error('AppE2EContext is read before init(): use it inside it() and hooks');
    }

    return this.state;
  }

  constructor() {
    super(AppModule, AppNameEnum.CUSTOMER_APP, AuthAudienceEnum.CUSTOMER);
  }

  public override async init(): Promise<void> {
    await super.init();

    const redis = this.moduleFixture.get<Redis>(CACHE_REDIS_CLIENT_TOKEN);
    const annToken = this.jwt.sign({ sub: '101' });
    const bobToken = this.jwt.sign({ sub: '102' });
    const carolToken = this.jwt.sign({ sub: '103' });

    this.state = { redis, annToken, bobToken, carolToken };
  }

  public async takeLedgerRecords(): Promise<ILedgerRecordProcessorPayload[]> {
    const queue = this.moduleFixture.get<Queue<ILedgerRecordProcessorPayload>>(
      getQueueToken(LedgerQueue.NAME),
    );
    const jobs = await queue.getWaiting();

    await queue.drain();

    return jobs.map((job) => job.data);
  }

  public async takePostSubtractJobs(): Promise<IProductStockPostSubtractPayload[]> {
    const queue = this.moduleFixture.get<Queue<IProductStockPostSubtractPayload>>(
      getQueueToken(ProductStockPostSubtractQueue.NAME),
    );
    const jobs = await queue.getWaiting();

    await queue.drain();

    return jobs.map((job) => job.data);
  }
}
