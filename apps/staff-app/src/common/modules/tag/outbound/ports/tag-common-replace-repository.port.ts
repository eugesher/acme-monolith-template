import type {
  ITagCommonReplaceFindLinkedQuery,
  ITagCommonReplaceLinkQuery,
  ITagCommonReplaceTagRecord,
  ITagCommonReplaceTagSubjectRecord,
  ITagCommonReplaceUnlinkQuery,
} from '../types';

export interface ITagCommonReplaceRepositoryPort {
  lockTags(tagIds: string[]): Promise<ITagCommonReplaceTagRecord[]>;
  findLinked(query: ITagCommonReplaceFindLinkedQuery): Promise<ITagCommonReplaceTagSubjectRecord[]>;
  link(query: ITagCommonReplaceLinkQuery): Promise<void>;
  unlink(query: ITagCommonReplaceUnlinkQuery): Promise<void>;
}

export const TAG_COMMON_REPLACE_REPOSITORY_PORT = Symbol('TAG_COMMON_REPLACE_REPOSITORY_PORT');
