import type { ITagGetManyQuery, ITagGetManyRecord } from '../types';

export interface ITagGetManyRepositoryPort {
  list(query: ITagGetManyQuery): Promise<ITagGetManyRecord>;
}

export const TAG_GET_MANY_REPOSITORY_PORT = Symbol('TAG_GET_MANY_REPOSITORY_PORT');
