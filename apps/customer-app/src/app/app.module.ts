import { Module } from '@nestjs/common';

import { AuthModule, CatalogModule, HealthModule, OrderModule } from '@acme-customer/features';
import { AuthGlobalModule } from '@acme-customer/global';

import { AppSetupModule } from './setup/app-setup.module';

@Module({
  imports: [
    AppSetupModule.forRoot(),
    AuthGlobalModule,
    AuthModule,
    CatalogModule,
    HealthModule,
    OrderModule,
  ],
})
export class AppModule {}
