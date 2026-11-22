import type { DynamicModule } from '@nestjs/common';

import { AppSetupBaseModule } from '@acme-libs/app';
import { AppNameEnum } from '@acme-libs/kernel';

import { entities } from '../entities';
import { ConfigSetupModule } from './config/config-setup.module';

export class AppSetupModule extends AppSetupBaseModule {
  public static forRoot(): DynamicModule {
    return AppSetupModule.setup({
      appName: AppNameEnum.PROCESSOR_APP,
      config: ConfigSetupModule.forRoot(),
      entities,
    });
  }
}
