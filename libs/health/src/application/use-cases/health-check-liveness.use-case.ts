import { Inject, Injectable } from '@nestjs/common';

import { HealthLivenessStatusEnum, type AppNameEnum } from '@acme-libs/kernel';
import type { IHealthLivenessView } from '@acme-libs/contracts/health';

import { HEALTH_APP_NAME_TOKEN, HEALTH_UPTIME_PORT, type IHealthUptimePort } from '../../outbound';

@Injectable()
export class HealthCheckLivenessUseCase {
  constructor(
    @Inject(HEALTH_APP_NAME_TOKEN)
    private readonly appName: AppNameEnum,
    @Inject(HEALTH_UPTIME_PORT)
    private readonly uptime: IHealthUptimePort,
  ) {}

  public execute(): IHealthLivenessView {
    const seconds = this.uptime.seconds();

    return {
      status: HealthLivenessStatusEnum.OK,
      app: this.appName,
      uptimeSeconds: Math.floor(seconds),
    };
  }
}
