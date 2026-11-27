import { Injectable } from '@nestjs/common';

import type {
  IHealthLibLivenessView,
  IHealthLibPort,
  IHealthLibReadinessView,
} from '@acme-libs/contracts/health';

import { HealthLibCheckLivenessCase, HealthLibCheckReadinessCase } from '../application';

@Injectable()
export class HealthLibFacade implements IHealthLibPort {
  constructor(
    private readonly checkLivenessCase: HealthLibCheckLivenessCase,
    private readonly checkReadinessCase: HealthLibCheckReadinessCase,
  ) {}

  public checkLiveness(): IHealthLibLivenessView {
    return this.checkLivenessCase.execute();
  }

  public async checkReadiness(): Promise<IHealthLibReadinessView> {
    return await this.checkReadinessCase.execute();
  }
}
