import type { ValueProvider } from '@nestjs/common';

import type { AppNameEnum } from '@acme-libs/kernel';

import { HEALTH_APP_NAME_TOKEN } from '../../outbound';

export class HealthAppNameProvider {
  public static provide(appName: AppNameEnum): ValueProvider<AppNameEnum> {
    return { provide: HEALTH_APP_NAME_TOKEN, useValue: appName };
  }
}
