import type { Maybe } from '@acme-libs/toolkit';

import type { ICacheWrapCommand } from '../types';

export interface ICachePort {
  get<T>(key: string): Promise<Maybe<T>>;
  delByPrefix(prefix: string): Promise<number>;
  wrap<T>(command: ICacheWrapCommand<T>): Promise<T>;
}

export const CACHE_PORT = Symbol('CACHE_PORT');
