export interface IHealthUptimePort {
  seconds(): number;
}

export const HEALTH_UPTIME_PORT = Symbol('HEALTH_UPTIME_PORT');
