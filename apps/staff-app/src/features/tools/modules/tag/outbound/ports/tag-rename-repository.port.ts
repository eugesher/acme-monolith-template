import type { ITagRenameQuery, TagRenameUpdateOutcomeEnum } from '../types';

export interface ITagRenameRepositoryPort {
  update(query: ITagRenameQuery): Promise<TagRenameUpdateOutcomeEnum>;
}

export const TAG_RENAME_REPOSITORY_PORT = Symbol('TAG_RENAME_REPOSITORY_PORT');
