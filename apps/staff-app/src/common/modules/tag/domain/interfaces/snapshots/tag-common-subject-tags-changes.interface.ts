import type { ITagCommonSubjectTagsLinkPayload } from './tag-common-subject-tags-link-payload.interface';

export interface ITagCommonSubjectTagsChanges {
  readonly link: ITagCommonSubjectTagsLinkPayload;
  readonly unlink: ITagCommonSubjectTagsLinkPayload;
}
