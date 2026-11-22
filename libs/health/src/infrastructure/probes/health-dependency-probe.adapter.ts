import { Inject, Injectable, type ClassProvider } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { HealthDependencyStatusEnum } from '@acme-libs/kernel';
import { DeadlineHelper } from '@acme-libs/toolkit';
import { CACHE_KEYS, CACHE_PORT, type ICachePort } from '@acme-libs/contracts/cache';
import type { IHealthDependenciesView, IHealthDependencyView } from '@acme-libs/contracts/health';

import { HEALTH_DEPENDENCY_PROBE_PORT, type IHealthDependencyProbePort } from '../../outbound';

@Injectable()
export class HealthDependencyProbeAdapter implements IHealthDependencyProbePort {
  public static readonly provider: ClassProvider<IHealthDependencyProbePort> = {
    provide: HEALTH_DEPENDENCY_PROBE_PORT,
    useClass: HealthDependencyProbeAdapter,
  };

  private static readonly TIMEOUT_MS = 1000;

  constructor(
    @Inject(CACHE_PORT)
    private readonly cache: ICachePort,
    private readonly dataSource: DataSource,
  ) {}

  public async probeAll(): Promise<IHealthDependenciesView> {
    const [database, cache] = await Promise.all([
      HealthDependencyProbeAdapter.timed(() => this.dataSource.query('SELECT 1')),
      HealthDependencyProbeAdapter.timed(() => this.cache.handleGet(CACHE_KEYS.healthProbe())),
    ]);

    return { database, cache };
  }

  private static async timed(probe: () => Promise<unknown>): Promise<IHealthDependencyView> {
    const startedAt = Date.now();

    try {
      await DeadlineHelper.race(probe, {
        timeoutMs: HealthDependencyProbeAdapter.TIMEOUT_MS,
        message: 'probe timed out',
      });

      return { status: HealthDependencyStatusEnum.OK, latencyMs: Date.now() - startedAt };
    } catch {
      return { status: HealthDependencyStatusEnum.ERROR, latencyMs: null };
    }
  }
}
