import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

import { CacheModule } from '@acme-libs/cache';
import { CredentialsModule } from '@acme-libs/credentials';
import { OrmModule } from '@acme-libs/database';
import {
  HttpExceptionFilter,
  HttpSecurityModule,
  StrictValidationPipe,
  ThrottlerSetupModule,
} from '@acme-libs/http';
import { AppNameEnum, AuthAudienceEnum } from '@acme-libs/kernel';
import { LocalStorageSetupModule } from '@acme-libs/local-storage';
import { LoggerSetupModule, TracerSetupModule } from '@acme-libs/observability';
import { BullSetupModule } from '@acme-libs/queue';
import {
  AccessModule,
  AuthModule,
  CatalogModule,
  HealthModule,
  LedgerModule,
  QueueModule,
  SalesModule,
  ToolsModule,
  WarehouseModule,
} from '@acme-staff/features';
import { AuthGlobalModule } from '@acme-staff/global';

import { entities } from './entities';
import { ConfigSetupModule } from './setup';

@Module({
  imports: [
    ConfigSetupModule.forRoot(),
    LoggerSetupModule.forRoot(AppNameEnum.STAFF_APP),
    TracerSetupModule.forRoot(),
    LocalStorageSetupModule.forRoot(),
    OrmModule.forRoot(entities),
    BullSetupModule.forRoot(),
    CacheModule.forRoot(),
    CredentialsModule.forRoot(AuthAudienceEnum.STAFF),
    HttpSecurityModule.forRoot(),
    ThrottlerSetupModule.forRoot(),
    AuthGlobalModule,
    HealthModule,
    AccessModule,
    AuthModule,
    LedgerModule,
    QueueModule,
    ToolsModule,
    CatalogModule,
    WarehouseModule,
    SalesModule,
  ],
  providers: [
    { provide: APP_PIPE, useClass: StrictValidationPipe },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
