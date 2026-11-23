import type { IHealthLivenessView, IHealthReadinessView } from '../types';

export interface IHealthPort {
  handleLiveness(): IHealthLivenessView;
  handleReadiness(): Promise<IHealthReadinessView>;
}

export const HEALTH_PORT = Symbol('HEALTH_PORT');
