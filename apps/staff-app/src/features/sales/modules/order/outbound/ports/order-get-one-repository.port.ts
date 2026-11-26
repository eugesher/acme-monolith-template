import type { Nullable } from '@acme-libs/toolkit';

import type { IOrderGetOneRecord } from '../types';

export interface IOrderGetOneRepositoryPort {
  findOne(orderId: string): Promise<Nullable<IOrderGetOneRecord>>;
}

export const ORDER_GET_ONE_REPOSITORY_PORT = Symbol('ORDER_GET_ONE_REPOSITORY_PORT');
