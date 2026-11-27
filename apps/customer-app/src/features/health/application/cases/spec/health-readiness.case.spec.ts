import { HealthDependencyStatusEnum, HealthReadinessStatusEnum } from '@acme-libs/kernel';

import { HealthReadinessCase } from '../health-readiness.case';
import type { IHealthStatusPort } from '../../../outbound';

describe('HealthReadinessCase', () => {
  let status: jest.Mocked<IHealthStatusPort>;
  let readinessCase: HealthReadinessCase;

  beforeEach(() => {
    status = { liveness: jest.fn(), readiness: jest.fn() };
    readinessCase = new HealthReadinessCase(status);
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

    const view = await readinessCase.execute();

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
