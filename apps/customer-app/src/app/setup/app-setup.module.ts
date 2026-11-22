import type { DynamicModule } from '@nestjs/common';

import { AppSetupBaseModule } from '@acme-libs/app';
import { CredentialsModule } from '@acme-libs/credentials';
import { AppNameEnum, AuthAudienceEnum } from '@acme-libs/kernel';

import { ConfigSetupModule } from './config/config-setup.module';
import { entities } from './entities';

export class AppSetupModule extends AppSetupBaseModule {
  public static forRoot(): DynamicModule {
    return AppSetupModule.setup({
      appName: AppNameEnum.CUSTOMER_APP,
      config: ConfigSetupModule.forRoot(),
      entities,
      imports: [CredentialsModule.forRoot(AuthAudienceEnum.CUSTOMER)],
    });
  }
}
