import type { IOrderGetListQuery, IOrderGetListRecord } from '../types';

export interface IOrderGetListRepositoryPort {
  list(query: IOrderGetListQuery): Promise<IOrderGetListRecord>;
}

export const ORDER_GET_MANY_REPOSITORY_PORT = Symbol('ORDER_GET_MANY_REPOSITORY_PORT');
