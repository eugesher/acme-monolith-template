import type { ITagCommonSubjectTagsLinkQuery } from './tag-common-subject-tags-link-query.interface';

export interface ITagCommonSubjectTagsChanges {
  readonly link: ITagCommonSubjectTagsLinkQuery;
  readonly unlink: ITagCommonSubjectTagsLinkQuery;
}
