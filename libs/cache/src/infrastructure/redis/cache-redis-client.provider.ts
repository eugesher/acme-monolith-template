import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { PinoLogger } from 'nestjs-pino';
import type { FactoryProvider } from '@nestjs/common';

import { RedisConfigHelper } from '@acme-libs/config';

import { CACHE_REDIS_CLIENT_TOKEN } from '../../outbound';

export class CacheRedisClientProvider {
  public static readonly PROVIDER: FactoryProvider<Redis> = {
    provide: CACHE_REDIS_CLIENT_TOKEN,
    inject: [ConfigService, PinoLogger],
    useFactory: (config: ConfigService, logger: PinoLogger): Redis =>
      CacheRedisClientProvider.create(config, logger),
  };

  private static create(config: ConfigService, logger: PinoLogger): Redis {
    const options = RedisConfigHelper.failFast(config);
    const redis = new Redis(options);

    logger.setContext(CacheRedisClientProvider.name);
    redis.on('error', (error: Error) => {
      logger.warn({ err: error }, 'Redis connection error, commands fail until it reconnects');
    });

    return redis;
  }
}
