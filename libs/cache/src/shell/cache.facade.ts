import { Injectable } from '@nestjs/common';

import type { Maybe } from '@acme-libs/toolkit';
import type { ICachePort, ICacheWrapCommand } from '@acme-libs/contracts/cache';

import { CacheDelByPrefixCase, CacheGetCase, CacheWrapCase } from '../application';

@Injectable()
export class CacheFacade implements ICachePort {
  constructor(
    private readonly getCase: CacheGetCase,
    private readonly delByPrefixCase: CacheDelByPrefixCase,
    private readonly wrapCase: CacheWrapCase,
  ) {}

  public async get<T>(key: string): Promise<Maybe<T>> {
    return await this.getCase.execute<T>(key);
  }

  public async delByPrefix(prefix: string): Promise<number> {
    return await this.delByPrefixCase.execute(prefix);
  }

  public async wrap<T>(command: ICacheWrapCommand<T>): Promise<T> {
    return await this.wrapCase.execute(command);
  }
}
