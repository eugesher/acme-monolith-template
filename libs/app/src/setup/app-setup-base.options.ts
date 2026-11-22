import type { DynamicModule } from '@nestjs/common';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

import type { AppNameEnum } from '@acme-libs/kernel';

export interface IAppSetupBaseOptions {
  appName: AppNameEnum;
  config: Promise<DynamicModule>;
  entities: TypeOrmModuleOptions['entities'];
  imports: DynamicModule[];
}
