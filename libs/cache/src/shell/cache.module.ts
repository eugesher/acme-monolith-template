import type { ClassProvider, DynamicModule } from '@nestjs/common';

import { CACHE_PORT, type ICachePort } from '@acme-libs/contracts/cache';

import { CacheDelByPrefixCase, CacheGetCase, CacheWrapCase } from '../application';
import { CacheRedisClientProvider, CacheStoreAdapter, CacheTracerAdapter } from '../infrastructure';
import { CacheFacade } from './cache.facade';

export class CacheModule {
  public static forRoot(): DynamicModule {
    return {
      module: CacheModule,
      global: true,
      exports: [CACHE_PORT],
      providers: [
        {
          provide: CACHE_PORT,
          useClass: CacheFacade,
        } satisfies ClassProvider<ICachePort>,
        CacheGetCase,
        CacheDelByPrefixCase,
        CacheWrapCase,
        CacheStoreAdapter.PROVIDER,
        CacheTracerAdapter.PROVIDER,
        CacheRedisClientProvider.PROVIDER,
      ],
    };
  }
}
