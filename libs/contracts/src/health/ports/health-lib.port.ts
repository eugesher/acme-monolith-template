import type { IHealthLibLivenessView, IHealthLibReadinessView } from '../types';

export interface IHealthLibPort {
  handleLiveness(): IHealthLibLivenessView;
  handleReadiness(): Promise<IHealthLibReadinessView>;
}

export const HEALTH_LIB_PORT = Symbol('HEALTH_LIB_PORT');
