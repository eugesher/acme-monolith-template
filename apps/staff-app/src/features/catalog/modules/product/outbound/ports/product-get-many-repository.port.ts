import type { IProductGetManyListQuery, IProductGetManyRecord } from '../types';

export interface IProductGetManyRepositoryPort {
  list(query: IProductGetManyListQuery): Promise<IProductGetManyRecord>;
}

export const PRODUCT_GET_MANY_REPOSITORY_PORT = Symbol('PRODUCT_GET_MANY_REPOSITORY_PORT');
