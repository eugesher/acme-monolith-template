import { Module } from '@nestjs/common';

import { HealthModule } from '@acme-processor/features';
import {
  IdempotencyPurgeModule,
  LedgerAppendModule,
  ProductStockPostSubtractModule,
} from '@acme-processor/processors';

import { AppSetupModule } from './setup/app-setup.module';

@Module({
  imports: [
    AppSetupModule.forRoot(),
    HealthModule,
    IdempotencyPurgeModule,
    LedgerAppendModule,
    ProductStockPostSubtractModule,
  ],
})
export class AppModule {}
