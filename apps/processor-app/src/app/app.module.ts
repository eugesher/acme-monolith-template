import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

import { CacheLibModule } from '@acme-libs/cache';
import { OrmModule } from '@acme-libs/database';
import {
  HttpExceptionFilter,
  HttpSecurityModule,
  StrictValidationPipe,
  ThrottlerSetupModule,
} from '@acme-libs/http';
import { AppNameEnum } from '@acme-libs/kernel';
import { LocalStorageSetupModule } from '@acme-libs/local-storage';
import { LoggerSetupModule, TracerSetupModule } from '@acme-libs/observability';
import { BullSetupModule } from '@acme-libs/queue';
import { HealthModule } from '@acme-processor/features';
import { IdempotencyModule, LedgerModule, ProductStockModule } from '@acme-processor/processors';

import { entities } from './entities';
import { ConfigSetupModule, ScheduleSetupModule } from './setup';

@Module({
  imports: [
    ConfigSetupModule.forRoot(),
    LoggerSetupModule.forRoot(AppNameEnum.PROCESSOR_APP),
    TracerSetupModule.forRoot(),
    LocalStorageSetupModule.forRoot(),
    OrmModule.forRoot(entities),
    ScheduleSetupModule,
    BullSetupModule.forRoot(),
    CacheLibModule,
    HttpSecurityModule.forRoot(),
    ThrottlerSetupModule.forRoot(),
    HealthModule,
    IdempotencyModule,
    LedgerModule,
    ProductStockModule,
  ],
  providers: [
    { provide: APP_PIPE, useClass: StrictValidationPipe },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
