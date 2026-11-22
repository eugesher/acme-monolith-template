import type { DynamicModule } from '@nestjs/common';

import { AppSetupBaseModule } from '@acme-libs/app';
import { CredentialsModule } from '@acme-libs/credentials';
import { AppNameEnum, AuthAudienceEnum } from '@acme-libs/kernel';

import { entities } from '../entities';
import { ConfigSetupModule } from './config/config-setup.module';

export class AppSetupModule extends AppSetupBaseModule {
  public static forRoot(): DynamicModule {
    return AppSetupModule.setup({
      appName: AppNameEnum.STAFF_APP,
      config: ConfigSetupModule.forRoot(),
      entities,
      imports: [CredentialsModule.forRoot(AuthAudienceEnum.STAFF)],
    });
  }
}
