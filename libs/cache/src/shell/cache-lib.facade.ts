import { Injectable } from '@nestjs/common';

import type { Maybe } from '@acme-libs/toolkit';
import type { ICacheLibPort, ICacheLibWrapCommand } from '@acme-libs/contracts/cache';

import {
  CacheLibDelByPrefixUseCase,
  CacheLibGetUseCase,
  CacheLibWrapUseCase,
} from '../application';

@Injectable()
export class CacheLibFacade implements ICacheLibPort {
  constructor(
    private readonly get: CacheLibGetUseCase,
    private readonly delByPrefix: CacheLibDelByPrefixUseCase,
    private readonly wrap: CacheLibWrapUseCase,
  ) {}

  public async handleGet<T>(key: string): Promise<Maybe<T>> {
    return await this.get.execute<T>(key);
  }

  public async handleDelByPrefix(prefix: string): Promise<number> {
    return await this.delByPrefix.execute(prefix);
  }

  public async handleWrap<T>(command: ICacheLibWrapCommand<T>): Promise<T> {
    return await this.wrap.execute(command);
  }
}
