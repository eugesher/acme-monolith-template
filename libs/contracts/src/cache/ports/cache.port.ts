import type { Maybe } from '@acme-libs/toolkit';

import type { ICacheWrapCommand } from '../types';

export interface ICachePort {
  handleGet<T>(key: string): Promise<Maybe<T>>;
  handleDelByPrefix(prefix: string): Promise<number>;
  handleWrap<T>(command: ICacheWrapCommand<T>): Promise<T>;
}

export const CACHE_PORT = Symbol('CACHE_PORT');
