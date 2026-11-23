import type { Maybe } from '@acme-libs/toolkit';

import type { ICacheStoreSetCommand } from '../types';

export interface ICacheStorePort {
  get<T>(key: string): Promise<Maybe<T>>;
  set<T>(command: ICacheStoreSetCommand<T>): Promise<void>;
  unlinkByPrefix(prefix: string): Promise<number>;
}

export const CACHE_STORE_PORT = Symbol('CACHE_STORE_PORT');
