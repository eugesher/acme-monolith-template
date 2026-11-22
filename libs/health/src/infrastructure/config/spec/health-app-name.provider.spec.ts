import { AppNameEnum } from '@acme-libs/kernel';

import { HEALTH_APP_NAME_TOKEN } from '../../../outbound';
import { HealthAppNameProvider } from '../health-app-name.provider';

describe('HealthAppNameProvider', () => {
  it('binds the app name to the health lib token', () => {
    const provider = HealthAppNameProvider.provide(AppNameEnum.STAFF_APP);

    expect(provider).toEqual({ provide: HEALTH_APP_NAME_TOKEN, useValue: 'staff-app' });
  });
});
