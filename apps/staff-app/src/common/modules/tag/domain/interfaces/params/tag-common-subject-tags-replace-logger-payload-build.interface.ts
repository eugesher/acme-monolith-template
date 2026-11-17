import type { ITagCommonSubjectTagsTag } from './tag-common-subject-tags-tag.interface';

export interface ITagCommonSubjectTagsReplaceLoggerPayloadBuild {
  subjectType: string;
  subjectId: string;
  tags: ITagCommonSubjectTagsTag[];
}
