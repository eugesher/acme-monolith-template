import type { IHealthLivenessView, IHealthReadinessView } from '../interfaces';

export interface IHealthPort {
  handleLiveness(): IHealthLivenessView;
  handleReadiness(): Promise<IHealthReadinessView>;
}

export const HEALTH_PORT = Symbol('HEALTH_PORT');
