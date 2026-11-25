import type { ITagUpdateQuery, TagUpdateOutcomeEnum } from '../types';

export interface ITagUpdateRepositoryPort {
  update(query: ITagUpdateQuery): Promise<TagUpdateOutcomeEnum>;
}

export const TAG_UPDATE_REPOSITORY_PORT = Symbol('TAG_UPDATE_REPOSITORY_PORT');
