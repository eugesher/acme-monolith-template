import type {
  ITagCommonSubjectTagsReplaceChanges,
  ITagCommonSubjectTagsReplaceLoggerPayload,
  ITagCommonSubjectTagsReplaceLoggerPayloadBuild,
  ITagCommonSubjectTagsReplaceReconstitute,
  ITagCommonSubjectTagsReplaceTag,
  ITagCommonSubjectTagsReplaceTagSnapshot,
} from '../types';

export class TagCommonSubjectTagsReplaceModel {
  private constructor(
    private readonly subjectType: string,
    private readonly subjectId: string,
    private readonly tagIds: ReadonlySet<string>,
  ) {}

  public static missingTagIds(
    requested: readonly string[],
    foundTags: readonly ITagCommonSubjectTagsReplaceTag[],
  ): string[] {
    const known = new Set(foundTags.map((tag) => tag.id));
    const distinct = new Set(requested);

    return [...distinct].filter((tagId) => !known.has(tagId));
  }

  public static reconstitute(
    record: ITagCommonSubjectTagsReplaceReconstitute,
  ): TagCommonSubjectTagsReplaceModel {
    const { subjectType, subjectId, subjectTags } = record;
    const tagIds = new Set(subjectTags.map((subjectTag) => subjectTag.tagId));

    return new TagCommonSubjectTagsReplaceModel(subjectType, subjectId, tagIds);
  }

  public static toSnapshots(
    tags: readonly ITagCommonSubjectTagsReplaceTag[],
  ): ITagCommonSubjectTagsReplaceTagSnapshot[] {
    return tags.map((tag) => ({ id: tag.id, name: tag.name }));
  }

  public static toLoggerPayload(
    params: ITagCommonSubjectTagsReplaceLoggerPayloadBuild,
  ): ITagCommonSubjectTagsReplaceLoggerPayload {
    const { subjectType, subjectId, tags } = params;
    const subjectTags = tags.map((tag) => ({ tagId: tag.id }));

    return { subjectType, subjectId, subjectTags };
  }

  public replace(
    tags: readonly ITagCommonSubjectTagsReplaceTag[],
  ): ITagCommonSubjectTagsReplaceChanges {
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
