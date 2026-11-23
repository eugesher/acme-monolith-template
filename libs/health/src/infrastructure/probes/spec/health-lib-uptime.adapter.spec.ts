import { HealthLibUptimeAdapter } from '../health-lib-uptime.adapter';

describe('HealthLibUptimeAdapter', () => {
  it('reports the uptime of the process', () => {
    jest.spyOn(process, 'uptime').mockReturnValue(12.5);

    const seconds = new HealthLibUptimeAdapter().seconds();

    expect(seconds).toBe(12.5);
  });
});
