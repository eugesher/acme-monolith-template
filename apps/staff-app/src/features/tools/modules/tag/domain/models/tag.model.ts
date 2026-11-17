import { AggregateRootBase } from '@acme-libs/toolkit';

import { TagNameInvalidException } from '../exceptions/tag-name-invalid.exception';
import type {
  ITagCandidate,
  ITagCandidateInit,
  ITagCreateLoggerPayload,
  ITagDeleteLoggerPayload,
  ITagReconstitute,
  ITagRenameLoggerPayload,
  ITagSnapshot,
  ITagUpdateQuery,
} from '../interfaces';

export class TagModel extends AggregateRootBase {
  public get name(): string {
    return this.currentName;
  }

  private static readonly NAME_MAX_LENGTH = 64;

  private constructor(
    id: string,
    private currentName: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    super(id);
  }

  public static reconstitute(record: ITagReconstitute): TagModel {
    const { id, name, createdAt, updatedAt } = record;
    const validName = TagModel.validName(name);

    return new TagModel(id, validName, createdAt, updatedAt);
  }

  public static initCandidate(proposal: ITagCandidateInit): ITagCandidate {
    const { name } = proposal;
    const validName = TagModel.validName(name);

    return { name: validName };
  }

  public rename(name: string): void {
    this.currentName = TagModel.validName(name);
  }

  public toSnapshot(): ITagSnapshot {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  public toUpdateQuery(): ITagUpdateQuery {
    return { id: this.id, name: this.name };
  }

  public toCreateLoggerPayload(): ITagCreateLoggerPayload {
    return { id: this.id, name: this.name };
  }

  public toRenameLoggerPayload(): ITagRenameLoggerPayload {
    return { id: this.id, name: this.name };
  }

  public toDeleteLoggerPayload(): ITagDeleteLoggerPayload {
    return { id: this.id };
  }

  private static validName(name: string): string {
    const trimmedName = name.trim();

    if (trimmedName.length === 0 || trimmedName.length > TagModel.NAME_MAX_LENGTH) {
      throw new TagNameInvalidException(TagModel.NAME_MAX_LENGTH);
    }

    return trimmedName;
  }
}
