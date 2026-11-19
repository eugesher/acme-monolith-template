import {
  HealthDependencyStatusEnum,
  HealthLivenessStatusEnum,
  HealthReadinessStatusEnum,
} from '@acme-libs/kernel';

import { HealthController } from '../health.controller';
import type { HealthLivenessUseCase, HealthReadinessUseCase } from '../../../application';

describe('HealthController', () => {
  let liveness: jest.Mocked<Pick<HealthLivenessUseCase, 'execute'>>;
  let readiness: jest.Mocked<Pick<HealthReadinessUseCase, 'execute'>>;
  let response: { status: jest.Mock };
  let controller: HealthController;

  beforeEach(() => {
    liveness = { execute: jest.fn() };
    readiness = { execute: jest.fn() };
    response = { status: jest.fn() };
    controller = new HealthController(
      liveness as unknown as HealthLivenessUseCase,
      readiness as unknown as HealthReadinessUseCase,
    );
  });

  it('answers liveness with the view of the use case', () => {
    liveness.execute.mockReturnValue({
      status: HealthLivenessStatusEnum.OK,
      app: 'staff-app',
      uptimeSeconds: 7,
    });

    const body = controller.handleLiveness();

    expect(body).toEqual({ status: 'ok', app: 'staff-app', uptimeSeconds: 7 });
  });

  it('answers 200 with the dependencies when ready', async () => {
    readiness.execute.mockResolvedValue({
      status: HealthReadinessStatusEnum.READY,
      app: 'staff-app',
      dependencies: {
        database: { status: HealthDependencyStatusEnum.OK, latencyMs: 2 },
        cache: { status: HealthDependencyStatusEnum.OK, latencyMs: 1 },
      },
    });

    const body = await controller.handleReadiness(response);

    expect(body).toEqual({
      status: 'ready',
      app: 'staff-app',
      dependencies: {
        database: { status: 'ok', latencyMs: 2 },
        cache: { status: 'ok', latencyMs: 1 },
      },
    });
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it('answers 503 with the dependencies when not ready', async () => {
    readiness.execute.mockResolvedValue({
      status: HealthReadinessStatusEnum.NOT_READY,
      app: 'staff-app',
      dependencies: {
        database: { status: HealthDependencyStatusEnum.OK, latencyMs: 2 },
        cache: { status: HealthDependencyStatusEnum.ERROR, latencyMs: null },
      },
    });

    const body = await controller.handleReadiness(response);

    expect(body).toEqual({
      status: 'not-ready',
      app: 'staff-app',
      dependencies: {
        database: { status: 'ok', latencyMs: 2 },
        cache: { status: 'error', latencyMs: null },
      },
    });
    expect(response.status).toHaveBeenCalledWith(503);
  });
});
