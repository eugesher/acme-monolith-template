import type { INestApplication } from '@nestjs/common';
import type { Redis } from 'ioredis';

import { AppNameEnum, AuthAudienceEnum } from '@acme-libs/kernel';
import { CACHE_REDIS_CLIENT_TOKEN } from '@acme-libs/testing';
import { AuthE2EContext } from '@acme-libs/testing';
import { AppModule } from '@acme-customer/app';
import { AppModule as ProcessorAppModule } from '@acme-processor/app';
import type { Maybe } from '@acme-libs/toolkit';

interface IAppE2EState {
  processor: INestApplication;
  redis: Redis;
  annToken: string;
}

export class AppE2EContext extends AuthE2EContext {
  public get redis(): Redis {
    return this.appE2EState.redis;
  }

  public get annToken(): string {
    return this.appE2EState.annToken;
  }

  private static readonly POLL_INTERVAL_MS = 500;
  private static readonly POLL_ATTEMPTS = 30;

  private _appE2EState: Maybe<IAppE2EState>;

  private get appE2EState(): IAppE2EState {
    if (!this._appE2EState) {
      throw new Error('AppE2EContext is read before init(): use it inside it() and hooks');
    }

    return this._appE2EState;
  }

  constructor() {
    super(AppModule, AppNameEnum.CUSTOMER_APP, AuthAudienceEnum.CUSTOMER);
  }

  public override async init(): Promise<void> {
    const processorFixture = await AppE2EContext.compile(ProcessorAppModule);
    const processor = processorFixture.createNestApplication();

    await processor.init();
    await super.init();

    const redis = this.moduleFixture.get<Redis>(CACHE_REDIS_CLIENT_TOKEN);
    const annToken = this.jwtService.sign({ sub: '101' });

    this._appE2EState = { processor, redis, annToken };
  }

  public override async close(): Promise<void> {
    await this.appE2EState.processor.close();
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
