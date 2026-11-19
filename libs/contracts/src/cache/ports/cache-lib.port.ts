import type { Maybe } from '@acme-libs/toolkit';

import type { ICacheLibWrapCommand } from '../interfaces';

export interface ICacheLibPort {
  handleGet<T>(key: string): Promise<Maybe<T>>;
  handleDelByPrefix(prefix: string): Promise<number>;
  handleWrap<T>(command: ICacheLibWrapCommand<T>): Promise<T>;
}

export const CACHE_LIB_PORT = Symbol('CACHE_LIB_PORT');
