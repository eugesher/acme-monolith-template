import { getQueueToken } from '@nestjs/bullmq';
import type { INestApplication } from '@nestjs/common';
import type { Queue } from 'bullmq';
import type { Redis } from 'ioredis';

import { AppNameEnum, AuthAudienceEnum } from '@acme-libs/kernel';
import { CACHE_LIB_REDIS_CLIENT_TOKEN } from '@acme-libs/testing';
import { AuthE2EContext } from '@acme-libs/testing';
import {
  LEDGER_RECORD_QUEUE,
  type ILedgerRecordProcessorPayload,
} from '@acme-core/contracts/ledger';
import { AppModule as ProcessorAppModule } from '@acme-processor/app/app.module';
import { AppModule } from '@acme-staff/app/app.module';
import type { Maybe } from '@acme-libs/toolkit';

interface IAppE2EState {
  processor: INestApplication;
  redis: Redis;
  ledgerRecordQueue: Queue<ILedgerRecordProcessorPayload>;
  adminToken: string;
  editorToken: string;
}

export class AppE2EContext extends AuthE2EContext {
  public get redis(): Redis {
    return this.started.redis;
  }

  public get ledgerRecordQueue(): Queue<ILedgerRecordProcessorPayload> {
    return this.started.ledgerRecordQueue;
  }

  public get adminToken(): string {
    return this.started.adminToken;
  }

  public get editorToken(): string {
    return this.started.editorToken;
  }

  private static readonly POLL_INTERVAL_MS = 500;
  private static readonly POLL_ATTEMPTS = 30;

  private state: Maybe<IAppE2EState>;

  private get started(): IAppE2EState {
    if (!this.state) {
      throw new Error('AppE2EContext is read before init(): use it inside it() and hooks');
    }

    return this.state;
  }

  constructor() {
    super(AppModule, AppNameEnum.STAFF_APP, AuthAudienceEnum.STAFF);
  }

  public override async init(): Promise<void> {
    const processorFixture = await AppE2EContext.compile(ProcessorAppModule);
    const processor = processorFixture.createNestApplication();

    await processor.init();
    await super.init();

    const redis = this.moduleFixture.get<Redis>(CACHE_LIB_REDIS_CLIENT_TOKEN);
    const ledgerRecordQueue = this.moduleFixture.get<Queue<ILedgerRecordProcessorPayload>>(
      getQueueToken(LEDGER_RECORD_QUEUE),
    );
    const adminToken = this.jwt.sign({ sub: '1' });
    const editorToken = this.jwt.sign({ sub: '2' });

    this.state = { processor, redis, ledgerRecordQueue, adminToken, editorToken };
  }

  public override async close(): Promise<void> {
    await this.started.processor.close();
    await super.close();
  }

  public async pollUntil<T>(read: () => Promise<T>, isDone: (value: T) => boolean): Promise<T> {
    await AppE2EContext.delay();

    let value = await read();

    for (let attempt = 1; attempt < AppE2EContext.POLL_ATTEMPTS && !isDone(value); attempt++) {
      await AppE2EContext.delay();
      value = await read();
    }

    return value;
  }

  private static async delay(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, AppE2EContext.POLL_INTERVAL_MS));
  }
}
