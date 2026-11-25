import type { ITagCommonFindSubjectIdsByTagQuery, ITagCommonFindSubjectIdsRecord } from '../types';

export interface ITagCommonFindSubjectIdsRepositoryPort {
  findByTag(query: ITagCommonFindSubjectIdsByTagQuery): Promise<ITagCommonFindSubjectIdsRecord[]>;
}

export const TAG_COMMON_FIND_SUBJECT_IDS_REPOSITORY_PORT = Symbol(
  'TAG_COMMON_FIND_SUBJECT_IDS_REPOSITORY_PORT',
);
