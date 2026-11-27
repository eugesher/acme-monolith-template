import { HealthLivenessStatusEnum } from '@acme-libs/kernel';

import { HealthLivenessCase } from '../health-liveness.case';
import type { IHealthStatusPort } from '../../../outbound';

describe('HealthLivenessCase', () => {
  let status: jest.Mocked<IHealthStatusPort>;
  let livenessCase: HealthLivenessCase;

  beforeEach(() => {
    status = { liveness: jest.fn(), readiness: jest.fn() };
    livenessCase = new HealthLivenessCase(status);
  });

  it('answers the liveness of the process', () => {
    status.liveness.mockReturnValue({
      status: HealthLivenessStatusEnum.OK,
      app: 'processor-app',
      uptimeSeconds: 7,
    });

    const view = livenessCase.execute();

    expect(view).toEqual({ status: 'ok', app: 'processor-app', uptimeSeconds: 7 });
  });
});
