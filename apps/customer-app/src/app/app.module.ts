import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

import { CacheLibModule } from '@acme-libs/cache';
import { CredentialsLibModule } from '@acme-libs/credentials';
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
import { AuthModule, CatalogModule, HealthModule, OrderModule } from '@acme-customer/features';
import { AuthGlobalModule } from '@acme-customer/global';

import { entities } from './entities';
import { ConfigSetupModule } from './setup';

@Module({
  imports: [
    ConfigSetupModule.forRoot(),
    LoggerSetupModule.forRoot(AppNameEnum.CUSTOMER_APP),
    TracerSetupModule.forRoot(),
    LocalStorageSetupModule.forRoot(),
    OrmModule.forRoot(entities),
    BullSetupModule.forRoot(),
    CacheLibModule,
    CredentialsLibModule.forRoot(AuthAudienceEnum.CUSTOMER),
    HttpSecurityModule.forRoot(),
    ThrottlerSetupModule.forRoot(),
    AuthGlobalModule,
    HealthModule,
    AuthModule,
    CatalogModule,
    OrderModule,
  ],
  providers: [
    { provide: APP_PIPE, useClass: StrictValidationPipe },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
