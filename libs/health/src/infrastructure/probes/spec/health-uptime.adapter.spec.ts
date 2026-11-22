import { HealthUptimeAdapter } from '../health-uptime.adapter';

describe('HealthUptimeAdapter', () => {
  it('reports the uptime of the process', () => {
    jest.spyOn(process, 'uptime').mockReturnValue(12.5);

    const seconds = new HealthUptimeAdapter().seconds();

    expect(seconds).toBe(12.5);
  });
});
