import { TagAggregate } from '../aggregates/tag.aggregate';
import type {
  ITagReconstitute,
  ITagRenameLoggerPayload,
  ITagRenameUpdatePayload,
} from '../interfaces';

export class TagRenameModel extends TagAggregate {
  public get name(): string {
    return this.currentName;
  }

  public static reconstitute(this: void, record: ITagReconstitute): TagRenameModel {
    const { id, name, createdAt, updatedAt } = record;
    const validName = TagRenameModel.validName(name);

    return new TagRenameModel(id, validName, createdAt, updatedAt);
  }

  public rename(name: string): void {
    this.currentName = TagRenameModel.validName(name);
  }

  public toUpdatePayload(): ITagRenameUpdatePayload {
    return { id: this.id, name: this.currentName };
  }

  public toLoggerPayload(): ITagRenameLoggerPayload {
    return { id: this.id, name: this.currentName };
  }
}
