import type { ITagCommonSubjectTagsReplaceTag } from './tag-common-subject-tags-replace-tag.interface';

export interface ITagCommonSubjectTagsReplaceLoggerPayloadBuild {
  subjectType: string;
  subjectId: string;
  tags: ITagCommonSubjectTagsReplaceTag[];
}
