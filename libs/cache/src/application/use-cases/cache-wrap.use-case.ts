import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import type { Maybe } from '@acme-libs/toolkit';
import type { ICacheWrapCommand } from '@acme-libs/contracts/cache';

import {
  CACHE_STORE_PORT,
  CACHE_TRACER_PORT,
  type ICacheStorePort,
  type ICacheTracerPort,
  type ICacheTracerSpanCommand,
} from '../../outbound';

@Injectable()
export class CacheWrapUseCase {
  private readonly inFlight = new Map<string, Promise<unknown>>();

  constructor(
    @Inject(CACHE_STORE_PORT)
    private readonly store: ICacheStorePort,
    @Inject(CACHE_TRACER_PORT)
    private readonly tracer: ICacheTracerPort,
    @InjectPinoLogger(CacheWrapUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute<T>(command: ICacheWrapCommand<T>): Promise<T> {
    const { key } = command;
    const pending = this.inFlight.get(key) as Maybe<Promise<T>>;

    if (pending) {
      return await pending;
    }

    const promise = this.tracer
      .span({
        name: 'cache.wrap',
        attributes: { 'cache.key': key },
        work: (attributes) => this.readThrough(command, attributes),
      })
      .finally(() => {
        this.inFlight.delete(key);
      });

    this.inFlight.set(key, promise);

    return await promise;
  }

  private async readThrough<T>(
    command: ICacheWrapCommand<T>,
    attributes: ICacheTracerSpanCommand<T>['attributes'],
  ): Promise<T> {
    const { key, ttlMs, compute } = command;
    let cached: Maybe<T>;

    try {
      cached = await this.store.get<T>(key);
    } catch (error) {
      this.logger.warn(
        { err: error, key },
        'Cache read failed, computing the value without caching it',
      );
      attributes['cache.hit'] = false;
      attributes['cache.error'] = 'read';

      return await compute();
    }

    if (cached !== undefined) {
      attributes['cache.hit'] = true;

      return cached;
    }

    attributes['cache.hit'] = false;

    const computedValue = await compute();

    if (computedValue !== undefined && computedValue !== null) {
      try {
        await this.store.set({ key, value: computedValue, ttlMs });
      } catch (error) {
        this.logger.warn({ err: error, key }, 'Cache write failed');
        attributes['cache.error'] = 'write';
      }
    }

    return computedValue;
  }
}
