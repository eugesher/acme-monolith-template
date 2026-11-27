import { Module } from '@nestjs/common';

import { HealthLibModule } from '@acme-libs/health';
import { AppNameEnum } from '@acme-libs/kernel';

import { HealthLivenessCase, HealthReadinessCase } from '../application';
import { HealthStatusLibAdapter } from '../infrastructure';
import { HealthController } from './health.controller';

@Module({
  imports: [HealthLibModule.forRoot(AppNameEnum.STAFF_APP)],
  controllers: [HealthController],
  providers: [HealthLivenessCase, HealthReadinessCase, HealthStatusLibAdapter.PROVIDER],
})
export class HealthModule {}
