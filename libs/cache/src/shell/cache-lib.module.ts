import { Global, Module } from '@nestjs/common';

import { CACHE_LIB_PORT } from '@acme-libs/contracts/cache';

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

@Global()
@Module({
  exports: [CACHE_LIB_PORT],
  providers: [
    { provide: CACHE_LIB_PORT, useClass: CacheLibFacade },
    CacheLibGetUseCase,
    CacheLibDelByPrefixUseCase,
    CacheLibWrapUseCase,
    CacheLibStoreAdapter.provider,
    CacheLibTracerAdapter.provider,
    CacheLibRedisClientProvider.provider,
  ],
})
export class CacheLibModule {}
