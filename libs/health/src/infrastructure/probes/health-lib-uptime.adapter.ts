import { Injectable, type ClassProvider } from '@nestjs/common';

import { HEALTH_LIB_UPTIME_PORT, type IHealthLibUptimePort } from '../../outbound';

@Injectable()
export class HealthLibUptimeAdapter implements IHealthLibUptimePort {
  public static readonly PROVIDER: ClassProvider<IHealthLibUptimePort> = {
    provide: HEALTH_LIB_UPTIME_PORT,
    useClass: HealthLibUptimeAdapter,
  };

  public seconds(): number {
    return process.uptime();
  }
}
