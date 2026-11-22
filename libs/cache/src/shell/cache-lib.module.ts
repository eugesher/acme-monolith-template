import type { ClassProvider, DynamicModule } from '@nestjs/common';

import { CACHE_LIB_PORT, type ICacheLibPort } from '@acme-libs/contracts/cache';

import {
  CacheLibDelByPrefixUseCase,
  CacheLibGetUseCase,
  CacheLibWrapUseCase,
} from '../application';
import {
  CacheLibRedisClientProvider,
  CacheLibStoreAdapter,
  CacheLibTracerAdapter,
} from '../infrastructure';
import { CacheLibFacade } from './cache-lib.facade';

export class CacheLibModule {
  public static forRoot(): DynamicModule {
    return {
      module: CacheLibModule,
      global: true,
      exports: [CACHE_LIB_PORT],
      providers: [
        {
          provide: CACHE_LIB_PORT,
          useClass: CacheLibFacade,
        } satisfies ClassProvider<ICacheLibPort>,
        CacheLibGetUseCase,
        CacheLibDelByPrefixUseCase,
        CacheLibWrapUseCase,
        CacheLibStoreAdapter.provider,
        CacheLibTracerAdapter.provider,
        CacheLibRedisClientProvider.provider,
      ],
    };
  }
}
