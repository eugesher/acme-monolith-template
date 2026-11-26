import { BullModule, type BullRootModuleOptions } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import type { DynamicModule } from '@nestjs/common';

import { RedisConfigHelper } from '@acme-libs/config';

export class BullSetupModule {
  private static readonly DEFAULT_JOB_OPTIONS: BullRootModuleOptions['defaultJobOptions'] = {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: true,
  };

  public static forRoot(): DynamicModule {
    return BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): BullRootModuleOptions => BullSetupModule.options(config),
    });
  }

  public static registerQueue(name: string): DynamicModule {
    return BullModule.registerQueue({ name });
  }

  private static options(config: ConfigService): BullRootModuleOptions {
    const connection = RedisConfigHelper.connection(config);

    return {
      connection,
      prefix: config.getOrThrow<string>('QUEUE_PREFIX'),
      defaultJobOptions: BullSetupModule.DEFAULT_JOB_OPTIONS,
    };
  }
}
