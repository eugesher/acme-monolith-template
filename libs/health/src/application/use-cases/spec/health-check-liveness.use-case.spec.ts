import { AppNameEnum } from '@acme-libs/kernel';

import { HealthCheckLivenessUseCase } from '../health-check-liveness.use-case';

describe('HealthCheckLivenessUseCase', () => {
  it('names the deployable and reports whole seconds of uptime', () => {
    const useCase = new HealthCheckLivenessUseCase(AppNameEnum.CUSTOMER_APP, {
      seconds: () => 42.9,
    });

    const view = useCase.execute();

    expect(view).toEqual({ status: 'ok', app: 'customer-app', uptimeSeconds: 42 });
  });
});
