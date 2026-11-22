import type { ClassProvider, DynamicModule } from '@nestjs/common';

import { HEALTH_PORT, type IHealthPort } from '@acme-libs/contracts/health';
import type { AppNameEnum } from '@acme-libs/kernel';

import { HealthCheckLivenessUseCase, HealthCheckReadinessUseCase } from '../application';
import {
  HealthAppNameProvider,
  HealthDependencyProbeAdapter,
  HealthUptimeAdapter,
} from '../infrastructure';
import { HealthFacade } from './health.facade';

export class HealthLibModule {
  public static forRoot(appName: AppNameEnum): DynamicModule {
    return {
      module: HealthLibModule,
      exports: [HEALTH_PORT],
      providers: [
        {
          provide: HEALTH_PORT,
          useClass: HealthFacade,
        } satisfies ClassProvider<IHealthPort>,
        HealthCheckLivenessUseCase,
        HealthCheckReadinessUseCase,
        HealthDependencyProbeAdapter.provider,
        HealthAppNameProvider.provide(appName),
        HealthUptimeAdapter.provider,
      ],
    };
  }
}
