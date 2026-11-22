import type { IHealthDependenciesView } from '@acme-libs/contracts/health';

export interface IHealthDependencyProbePort {
  probeAll(): Promise<IHealthDependenciesView>;
}

export const HEALTH_DEPENDENCY_PROBE_PORT = Symbol('HEALTH_DEPENDENCY_PROBE_PORT');
