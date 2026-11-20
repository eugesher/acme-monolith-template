import { Test } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';
import { DataSource } from 'typeorm';
import type { INestApplication, Type } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

import { AppBootstrap } from '@acme-libs/bootstrap';
import type { AppNameEnum } from '@acme-libs/kernel';
import type { Maybe } from '@acme-libs/toolkit';

interface IE2EContextState {
  app: INestApplication;
  moduleFixture: TestingModule;
  dataSource: DataSource;
  rootLoggerWarn: jest.SpiedFunction<PinoLogger['warn']>;
}

export class E2EContext {
  public get app(): INestApplication {
    return this.initialized.app;
  }

  public get moduleFixture(): TestingModule {
    return this.initialized.moduleFixture;
  }

  public get dataSource(): DataSource {
    return this.initialized.dataSource;
  }

  private context: Maybe<IE2EContextState>;

  private get initialized(): IE2EContextState {
    if (!this.context) {
      throw new Error('The e2e context is read before init(): use it inside it() and hooks');
    }

    return this.context;
  }

  constructor(
    private readonly appModule: Type<unknown>,
    private readonly appName: AppNameEnum,
  ) {}

  public async init(): Promise<void> {
    const moduleFixture = await E2EContext.compile(this.appModule);
    const dataSource = moduleFixture.get(DataSource);
    const app = await E2EContext.start(moduleFixture, this.appName);
    const rootLoggerWarn = jest.spyOn(PinoLogger.root, 'warn');

    this.context = { app, moduleFixture, dataSource, rootLoggerWarn };
  }

  public async close(): Promise<void> {
    await this.app.close();
  }

  public takeRootWarnings(): unknown[][] {
    const { calls, contexts } = this.initialized.rootLoggerWarn.mock;
    const warnings = calls.filter((_, index) => contexts[index] === PinoLogger.root);

    this.initialized.rootLoggerWarn.mockClear();

    return warnings;
  }

  protected static async compile(appModule: Type<unknown>): Promise<TestingModule> {
    return await Test.createTestingModule({ imports: [appModule] }).compile();
  }

  private static async start(
    moduleFixture: TestingModule,
    appName: AppNameEnum,
  ): Promise<INestApplication> {
    const app = moduleFixture.createNestApplication({ bufferLogs: true });
    const bootstrap = AppBootstrap.create(app, appName);

    await bootstrap.execute();

    return app;
  }
}
