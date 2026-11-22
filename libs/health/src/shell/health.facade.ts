import { Injectable } from '@nestjs/common';

import type {
  IHealthLivenessView,
  IHealthPort,
  IHealthReadinessView,
} from '@acme-libs/contracts/health';

import { HealthCheckLivenessUseCase, HealthCheckReadinessUseCase } from '../application';

@Injectable()
export class HealthFacade implements IHealthPort {
  constructor(
    private readonly checkLiveness: HealthCheckLivenessUseCase,
    private readonly checkReadiness: HealthCheckReadinessUseCase,
  ) {}

  public handleLiveness(): IHealthLivenessView {
    return this.checkLiveness.execute();
  }

  public async handleReadiness(): Promise<IHealthReadinessView> {
    return await this.checkReadiness.execute();
  }
}
