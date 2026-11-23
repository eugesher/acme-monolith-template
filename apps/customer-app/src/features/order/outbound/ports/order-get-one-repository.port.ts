import type { Nullable } from '@acme-libs/toolkit';

import type { IOrderGetOneQuery, IOrderGetOneRecord } from '../types';

export interface IOrderGetOneRepositoryPort {
  findOwned(query: IOrderGetOneQuery): Promise<Nullable<IOrderGetOneRecord>>;
}

export const ORDER_GET_ONE_REPOSITORY_PORT = Symbol('ORDER_GET_ONE_REPOSITORY_PORT');
