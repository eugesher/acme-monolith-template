import { AppNameEnum } from '@acme-libs/kernel';

import { HealthLibCheckLivenessCase } from '../health-lib-check-liveness.case';

describe('HealthLibCheckLivenessCase', () => {
  it('names the deployable and reports whole seconds of uptime', () => {
    const checkLivenessCase = new HealthLibCheckLivenessCase(AppNameEnum.CUSTOMER_APP, {
      seconds: () => 42.9,
    });

    const view = checkLivenessCase.execute();

    expect(view).toEqual({ status: 'ok', app: 'customer-app', uptimeSeconds: 42 });
  });
});
