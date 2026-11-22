import { Injectable } from '@nestjs/common';

import type { Maybe } from '@acme-libs/toolkit';
import type { ICachePort, ICacheWrapCommand } from '@acme-libs/contracts/cache';

import { CacheDelByPrefixUseCase, CacheGetUseCase, CacheWrapUseCase } from '../application';

@Injectable()
export class CacheFacade implements ICachePort {
  constructor(
    private readonly get: CacheGetUseCase,
    private readonly delByPrefix: CacheDelByPrefixUseCase,
    private readonly wrap: CacheWrapUseCase,
  ) {}

  public async handleGet<T>(key: string): Promise<Maybe<T>> {
    return await this.get.execute<T>(key);
  }

  public async handleDelByPrefix(prefix: string): Promise<number> {
    return await this.delByPrefix.execute(prefix);
  }

  public async handleWrap<T>(command: ICacheWrapCommand<T>): Promise<T> {
    return await this.wrap.execute(command);
  }
}
