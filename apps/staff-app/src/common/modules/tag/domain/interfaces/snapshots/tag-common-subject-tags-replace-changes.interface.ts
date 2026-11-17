import type { ITagCommonSubjectTagsReplaceLinkPayload } from './tag-common-subject-tags-replace-link-payload.interface';

export interface ITagCommonSubjectTagsReplaceChanges {
  readonly link: ITagCommonSubjectTagsReplaceLinkPayload;
  readonly unlink: ITagCommonSubjectTagsReplaceLinkPayload;
}
