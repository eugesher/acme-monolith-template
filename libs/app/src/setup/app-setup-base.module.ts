import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import type { DynamicModule } from '@nestjs/common';

import { CacheModule } from '@acme-libs/cache';
import { OrmModule } from '@acme-libs/database';
import {
  HttpExceptionFilter,
  HttpSecurityModule,
  StrictValidationPipe,
  ThrottlerSetupModule,
} from '@acme-libs/http';
import { LocalStorageSetupModule } from '@acme-libs/local-storage';
import { LoggerSetupModule, TracerSetupModule } from '@acme-libs/observability';
import { BullSetupModule } from '@acme-libs/queue';

import type { IAppSetupBaseOptions } from './app-setup-base.options';

export class AppSetupBaseModule {
  protected static setup(options: IAppSetupBaseOptions): DynamicModule {
    const { appName, config, entities, imports } = options;

    return {
      module: this,
      imports: [
        config,
        BullSetupModule.forRoot(),
        CacheModule.forRoot(),
        HttpSecurityModule.forRoot(),
        LocalStorageSetupModule.forRoot(),
        LoggerSetupModule.forRoot(appName),
        OrmModule.forRoot(entities),
        ThrottlerSetupModule.forRoot(),
        TracerSetupModule.forRoot(),
        ...imports,
      ],
      providers: [
        { provide: APP_FILTER, useClass: HttpExceptionFilter },
        { provide: APP_PIPE, useClass: StrictValidationPipe },
      ],
    };
  }
}
