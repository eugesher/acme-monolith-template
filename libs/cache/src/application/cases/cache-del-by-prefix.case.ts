import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import {
  CACHE_STORE_PORT,
  CACHE_TRACER_PORT,
  type ICacheStorePort,
  type ICacheTracerPort,
} from '../../outbound';

@Injectable()
export class CacheDelByPrefixCase {
  constructor(
    @Inject(CACHE_STORE_PORT)
    private readonly store: ICacheStorePort,
    @Inject(CACHE_TRACER_PORT)
    private readonly tracer: ICacheTracerPort,
    @InjectPinoLogger(CacheDelByPrefixCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(prefix: string): Promise<number> {
    return await this.tracer.span({
      name: 'cache.delByPrefix',
      attributes: { 'cache.prefix': prefix },
      work: async (attributes) => {
        try {
          const unlinked = await this.store.unlinkByPrefix(prefix);

          attributes['cache.keys_unlinked'] = unlinked;

          return unlinked;
        } catch (error) {
          this.logger.warn(
            { err: error, prefix },
            'Cache invalidation failed, entries expire on TTL',
          );
          attributes['cache.error'] = 'unlink';

          return 0;
        }
      },
    });
  }
}
