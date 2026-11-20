import { RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { ConfigService } from '@nestjs/config';
import { MetadataScanner, ModulesContainer, Reflector } from '@nestjs/core';
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

type IE2EContextHandler = (...args: never[]) => unknown;

interface IE2EContextRoute {
  route: string;
  targets: [IE2EContextHandler, Type<unknown>];
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

  public mountedRoutes(): string[] {
    return this.routes().map(({ route }) => route);
  }

  protected static async compile(appModule: Type<unknown>): Promise<TestingModule> {
    return await Test.createTestingModule({ imports: [appModule] }).compile();
  }

  protected routes(): IE2EContextRoute[] {
    const config = this.moduleFixture.get(ConfigService);
    const prefix = config.getOrThrow<string>('API_PREFIX');
    const reflector = this.app.get(Reflector);
    const container = this.app.get(ModulesContainer);
    const scanner = new MetadataScanner();
    const controllers = [...container.values()].flatMap((module) =>
      [...module.controllers.values()].map(({ metatype }) => metatype as Type<unknown>),
    );
    const routes = controllers.flatMap((controller) => {
      const prototype = controller.prototype as Record<string, IE2EContextHandler>;
      const controllerPath = reflector.get<string>(PATH_METADATA, controller);
      const handlers = scanner
        .getAllMethodNames(prototype)
        .map((name) => prototype[name])
        .filter((handler) => reflector.get<Maybe<string>>(PATH_METADATA, handler) !== undefined);

      return handlers.map((handler) => {
        const handlerPath = reflector.get<string>(PATH_METADATA, handler);
        const method = RequestMethod[reflector.get<RequestMethod>(METHOD_METADATA, handler)];
        const segments = [prefix, controllerPath, handlerPath]
          .join('/')
          .split('/')
          .filter((segment) => segment.length > 0);
        const path = `/${segments.join('/')}`;
        const targets: IE2EContextRoute['targets'] = [handler, controller];

        return { key: `${path} ${method}`, route: `${method} ${path}`, targets };
      });
    });

    return routes
      .sort((left, right) => (left.key < right.key ? -1 : 1))
      .map(({ route, targets }) => ({ route, targets }));
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
