import type {
  ITagCommonSubjectTagsChanges,
  ITagCommonSubjectTagsReconstitute,
  ITagCommonSubjectTagsReplaceLoggerPayload,
  ITagCommonSubjectTagsReplaceLoggerPayloadBuild,
  ITagCommonSubjectTagsTag,
  ITagCommonSubjectTagsTagSnapshot,
} from '../interfaces';

export class TagCommonSubjectTagsModel {
  private constructor(
    private readonly subjectType: string,
    private readonly subjectId: string,
    private readonly tagIds: ReadonlySet<string>,
  ) {}

  public static reconstitute(record: ITagCommonSubjectTagsReconstitute): TagCommonSubjectTagsModel {
    const { subjectType, subjectId, subjectTags } = record;
    const tagIds = new Set(subjectTags.map((subjectTag) => subjectTag.tagId));

    return new TagCommonSubjectTagsModel(subjectType, subjectId, tagIds);
  }

  public static missingTagIds(
    requested: readonly string[],
    foundTags: readonly ITagCommonSubjectTagsTag[],
  ): string[] {
    const known = new Set(foundTags.map((tag) => tag.id));
    const distinct = new Set(requested);

    return [...distinct].filter((tagId) => !known.has(tagId));
  }

  public static toTagSnapshots(
    tags: readonly ITagCommonSubjectTagsTag[],
  ): ITagCommonSubjectTagsTagSnapshot[] {
    return tags.map((tag) => ({ id: tag.id, name: tag.name }));
  }

  public static toReplaceLoggerPayload(
    params: ITagCommonSubjectTagsReplaceLoggerPayloadBuild,
  ): ITagCommonSubjectTagsReplaceLoggerPayload {
    const { subjectType, subjectId, tags } = params;
    const subjectTags = tags.map((tag) => ({ tagId: tag.id }));

    return { subjectType, subjectId, subjectTags };
  }

  public replace(tags: readonly ITagCommonSubjectTagsTag[]): ITagCommonSubjectTagsChanges {
    const { subjectType, subjectId } = this;
    const nextTagIds = new Set(tags.map((tag) => tag.id));
    const linkTagIds = [...nextTagIds].filter((tagId) => !this.tagIds.has(tagId));
    const unlinkTagIds = [...this.tagIds].filter((tagId) => !nextTagIds.has(tagId));

    return {
      link: { subjectType, subjectId, tagIds: linkTagIds },
      unlink: { subjectType, subjectId, tagIds: unlinkTagIds },
    };
  }
}
