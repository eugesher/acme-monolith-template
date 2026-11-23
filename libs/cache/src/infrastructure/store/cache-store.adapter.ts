import { Inject, Injectable, type ClassProvider, type OnApplicationShutdown } from '@nestjs/common';
import type { Redis } from 'ioredis';

import type { Maybe } from '@acme-libs/toolkit';

import {
  CACHE_REDIS_CLIENT_TOKEN,
  CACHE_STORE_PORT,
  type ICacheStorePort,
  type ICacheStoreSetCommand,
} from '../../outbound';

@Injectable()
export class CacheStoreAdapter implements ICacheStorePort, OnApplicationShutdown {
  public static readonly PROVIDER: ClassProvider<ICacheStorePort> = {
    provide: CACHE_STORE_PORT,
    useClass: CacheStoreAdapter,
  };

  private static readonly SCAN_BATCH_SIZE = 100;

  constructor(
    @Inject(CACHE_REDIS_CLIENT_TOKEN)
    private readonly redis: Redis,
  ) {}

  public async get<T>(key: string): Promise<Maybe<T>> {
    const rawValue = await this.redis.get(key);
    const cachedValue = rawValue === null ? null : (JSON.parse(rawValue) as T | null);

    return cachedValue ?? undefined;
  }

  public async set<T>(command: ICacheStoreSetCommand<T>): Promise<void> {
    const { key, value, ttlMs } = command;
    const rawValue = JSON.stringify(value);

    await this.redis.set(key, rawValue, 'PX', ttlMs);
  }

  public async unlinkByPrefix(prefix: string): Promise<number> {
    let cursor = '0';
    let unlinked = 0;

    do {
      const [next, keys] = await this.redis.scan(
        cursor,
        'MATCH',
        `${prefix}*`,
        'COUNT',
        CacheStoreAdapter.SCAN_BATCH_SIZE,
      );

      cursor = next;

      if (keys.length > 0) {
        unlinked += await this.redis.unlink(...keys);
      }
    } while (cursor !== '0');

    return unlinked;
  }

  public async onApplicationShutdown(): Promise<void> {
    if (this.redis.status === 'ready') {
      await this.redis.quit();

      return;
    }

    this.redis.disconnect();
  }
}
