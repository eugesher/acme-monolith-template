import type { ITagCommonFindBySubjectQuery, ITagCommonFindRecord } from '../types';

export interface ITagCommonFindRepositoryPort {
  findBySubject(query: ITagCommonFindBySubjectQuery): Promise<ITagCommonFindRecord[]>;
}

export const TAG_COMMON_FIND_REPOSITORY_PORT = Symbol('TAG_COMMON_FIND_REPOSITORY_PORT');
