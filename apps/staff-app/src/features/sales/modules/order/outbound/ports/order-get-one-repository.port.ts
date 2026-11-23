import type { Nullable } from '@acme-libs/toolkit';

import type { IOrderGetOneRecord } from '../types';

export interface IOrderGetOneRepositoryPort {
  findById(orderId: string): Promise<Nullable<IOrderGetOneRecord>>;
}

export const ORDER_GET_ONE_REPOSITORY_PORT = Symbol('ORDER_GET_ONE_REPOSITORY_PORT');
