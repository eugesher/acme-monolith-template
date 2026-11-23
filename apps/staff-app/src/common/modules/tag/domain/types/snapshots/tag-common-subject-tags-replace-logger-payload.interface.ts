export interface ITagCommonSubjectTagsReplaceLoggerPayload {
  readonly subjectType: string;
  readonly subjectId: string;
  readonly subjectTags: { readonly tagId: string }[];
}
