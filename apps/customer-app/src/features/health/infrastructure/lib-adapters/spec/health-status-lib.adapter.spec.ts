import {
  HealthDependencyStatusEnum,
  HealthLivenessStatusEnum,
  HealthReadinessStatusEnum,
} from '@acme-libs/kernel';
import type { IHealthLibPort } from '@acme-libs/contracts/health';

import { HealthStatusLibAdapter } from '../health-status-lib.adapter';

describe('HealthStatusLibAdapter', () => {
  let health: jest.Mocked<IHealthLibPort>;
  let adapter: HealthStatusLibAdapter;

  beforeEach(() => {
    health = { handleLiveness: jest.fn(), handleReadiness: jest.fn() };
    adapter = new HealthStatusLibAdapter(health);
  });

  describe('liveness', () => {
    it('answers the liveness of the health lib', () => {
      health.handleLiveness.mockReturnValue({
        status: HealthLivenessStatusEnum.OK,
        app: 'customer-app',
        uptimeSeconds: 7,
      });

      const view = adapter.liveness();

      expect(view).toEqual({ status: 'ok', app: 'customer-app', uptimeSeconds: 7 });
    });
  });

  describe('readiness', () => {
    it('answers the readiness of the health lib', async () => {
      health.handleReadiness.mockResolvedValue({
        status: HealthReadinessStatusEnum.READY,
        app: 'customer-app',
        dependencies: {
          database: { status: HealthDependencyStatusEnum.OK, latencyMs: 2 },
          cache: { status: HealthDependencyStatusEnum.OK, latencyMs: 1 },
        },
      });

      const view = await adapter.readiness();

      expect(view).toEqual({
        status: 'ready',
        app: 'customer-app',
        dependencies: {
          database: { status: 'ok', latencyMs: 2 },
          cache: { status: 'ok', latencyMs: 1 },
        },
      });
    });
  });
});
