import { Injectable, type ClassProvider } from '@nestjs/common';

import { HEALTH_UPTIME_PORT, type IHealthUptimePort } from '../../outbound';

@Injectable()
export class HealthUptimeAdapter implements IHealthUptimePort {
  public static readonly provider: ClassProvider<IHealthUptimePort> = {
    provide: HEALTH_UPTIME_PORT,
    useClass: HealthUptimeAdapter,
  };

  public seconds(): number {
    return process.uptime();
  }
}
