import type {
  HealthDependencyStatusEnum,
  HealthLivenessStatusEnum,
  HealthReadinessStatusEnum,
} from '@acme-libs/kernel';
import type { Nullable } from '@acme-libs/toolkit';

export interface IHealthLivenessView {
  status: HealthLivenessStatusEnum;
  app: string;
  uptimeSeconds: number;
}

export interface IHealthDependencyView {
  status: HealthDependencyStatusEnum;
  latencyMs: Nullable<number>;
}

export interface IHealthDependenciesView {
  database: IHealthDependencyView;
  cache: IHealthDependencyView;
}

export interface IHealthReadinessView {
  status: HealthReadinessStatusEnum;
  app: string;
  dependencies: IHealthDependenciesView;
}
