import { RequestMethod } from '@nestjs/common';
import {
  METHOD_METADATA,
  PARAMTYPES_METADATA,
  PATH_METADATA,
  ROUTE_ARGS_METADATA,
} from '@nestjs/common/constants';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import { ConfigService } from '@nestjs/config';
import { MetadataScanner, ModulesContainer, Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';
import { DataSource } from 'typeorm';
import type { INestApplication, Type } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

import { AppBootstrap } from '@acme-libs/app';
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
  dtos: string[];
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

  public routeDtos(): string[][] {
    return this.routes().map(({ route, dtos }) => [route, ...dtos]);
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
      const names = scanner
        .getAllMethodNames(prototype)
        .filter(
          (name) => reflector.get<Maybe<string>>(PATH_METADATA, prototype[name]) !== undefined,
        );

      return names.map((name) => {
        const handler = prototype[name];
        const handlerPath = reflector.get<string>(PATH_METADATA, handler);
        const method = RequestMethod[reflector.get<RequestMethod>(METHOD_METADATA, handler)];
        const segments = [prefix, controllerPath, handlerPath]
          .join('/')
          .split('/')
          .filter((segment) => segment.length > 0);
        const path = `/${segments.join('/')}`;
        const targets: IE2EContextRoute['targets'] = [handler, controller];
        const dtos = E2EContext.dtosOf(controller, prototype, name);

        return { key: `${path} ${method}`, route: `${method} ${path}`, targets, dtos };
      });
    });

    return routes
      .sort((left, right) => (left.key < right.key ? -1 : 1))
      .map(({ route, targets, dtos }) => ({ route, targets, dtos }));
  }

  private static dtosOf(controller: Type<unknown>, prototype: object, name: string): string[] {
    const args = (Reflect.getMetadata(ROUTE_ARGS_METADATA, controller, name) ?? {}) as Record<
      string,
      { index: number }
    >;
    const types = Reflect.getMetadata(PARAMTYPES_METADATA, prototype, name) as Type<unknown>[];
    const validated = [RouteParamtypes.PARAM, RouteParamtypes.QUERY, RouteParamtypes.BODY];

    return validated.flatMap((paramtype) =>
      Object.entries(args)
        .filter(([key]) => key.split(':')[0] === String(paramtype))
        .map(([, { index }]) => types[index].name),
    );
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
