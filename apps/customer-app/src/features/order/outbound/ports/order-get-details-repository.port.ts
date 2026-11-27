import type { Nullable } from '@acme-libs/toolkit';

import type { IOrderGetDetailsFindOwnedQuery, IOrderGetDetailsRecord } from '../types';

export interface IOrderGetDetailsRepositoryPort {
  findOwned(query: IOrderGetDetailsFindOwnedQuery): Promise<Nullable<IOrderGetDetailsRecord>>;
}

export const ORDER_GET_ONE_REPOSITORY_PORT = Symbol('ORDER_GET_ONE_REPOSITORY_PORT');
