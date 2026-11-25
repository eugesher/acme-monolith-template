import type { ITagCreateInsertQuery, ITagCreateInsertRecord, ITagCreateRecord } from '../types';

export interface ITagCreateRepositoryPort {
  insert(query: ITagCreateInsertQuery): Promise<ITagCreateInsertRecord>;
  findInserted(tagId: string): Promise<ITagCreateRecord>;
}

export const TAG_CREATE_REPOSITORY_PORT = Symbol('TAG_CREATE_REPOSITORY_PORT');
