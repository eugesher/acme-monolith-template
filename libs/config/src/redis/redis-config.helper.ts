import type { ConfigService } from '@nestjs/config';

import { TlsHelper } from '../tls/tls.helper';
import type { IRedisConnection, IRedisFailFastConnection } from './types';

export class RedisConfigHelper {
  public static connection(config: ConfigService): IRedisConnection {
    const host = config.getOrThrow<string>('REDIS_HOST');
    const port = config.getOrThrow<number>('REDIS_PORT');
    const password = config.getOrThrow<string>('REDIS_PASSWORD');
    const caPath = config.getOrThrow<string>('REDIS_TLS_CA');
    const tls = TlsHelper.options(caPath);

    return { host, port, password, tls };
  }

  public static failFast(config: ConfigService): IRedisFailFastConnection {
    const connection = RedisConfigHelper.connection(config);
    const commandTimeout = config.getOrThrow<number>('REDIS_COMMAND_TIMEOUT_MS');

    return { ...connection, enableOfflineQueue: false, commandTimeout };
  }
}
