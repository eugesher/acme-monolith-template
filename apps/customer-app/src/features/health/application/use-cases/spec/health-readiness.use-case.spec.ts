import { HealthDependencyStatusEnum, HealthReadinessStatusEnum } from '@acme-libs/kernel';

import { HealthReadinessUseCase } from '../health-readiness.use-case';
import type { IHealthStatusPort } from '../../../outbound';

describe('HealthReadinessUseCase', () => {
  let status: jest.Mocked<IHealthStatusPort>;
  let useCase: HealthReadinessUseCase;

  beforeEach(() => {
    status = { liveness: jest.fn(), readiness: jest.fn() };
    useCase = new HealthReadinessUseCase(status);
  });

  it('answers the readiness of the dependencies', async () => {
    status.readiness.mockResolvedValue({
      status: HealthReadinessStatusEnum.NOT_READY,
      app: 'customer-app',
      dependencies: {
        database: { status: HealthDependencyStatusEnum.OK, latencyMs: 2 },
        cache: { status: HealthDependencyStatusEnum.ERROR, latencyMs: null },
      },
    });

    const view = await useCase.execute();

    expect(view).toEqual({
      status: 'not-ready',
      app: 'customer-app',
      dependencies: {
        database: { status: 'ok', latencyMs: 2 },
        cache: { status: 'error', latencyMs: null },
      },
    });
  });
});
