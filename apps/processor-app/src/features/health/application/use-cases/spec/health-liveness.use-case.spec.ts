import { HealthLivenessStatusEnum } from '@acme-libs/kernel';

import { HealthLivenessUseCase } from '../health-liveness.use-case';
import type { IHealthStatusPort } from '../../../outbound';

describe('HealthLivenessUseCase', () => {
  let status: jest.Mocked<IHealthStatusPort>;
  let useCase: HealthLivenessUseCase;

  beforeEach(() => {
    status = { liveness: jest.fn(), readiness: jest.fn() };
    useCase = new HealthLivenessUseCase(status);
  });

  it('answers the liveness of the process', () => {
    status.liveness.mockReturnValue({
      status: HealthLivenessStatusEnum.OK,
      app: 'processor-app',
      uptimeSeconds: 7,
    });

    const view = useCase.execute();

    expect(view).toEqual({ status: 'ok', app: 'processor-app', uptimeSeconds: 7 });
  });
});
