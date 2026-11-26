import { Module } from '@nestjs/common';

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

import { AppSetupModule } from '../setup/app-setup.module';

@Module({
  imports: [
    AppSetupModule.forRoot(),
    AuthGlobalModule,
    AccessModule,
    AuthModule,
    CatalogModule,
    HealthModule,
    LedgerModule,
    QueueModule,
    SalesModule,
    ToolsModule,
    WarehouseModule,
  ],
})
export class AppModule {}
