import { TagAggregate } from '../aggregates/tag.aggregate';
import type {
  ITagReconstitute,
  ITagRenameLoggerPayload,
  ITagRenameUpdatePayload,
} from '../interfaces';

export class TagRenameModel extends TagAggregate {
  public get name(): string {
    return this._name;
  }

  public static reconstitute(this: void, record: ITagReconstitute): TagRenameModel {
    const { id, name, createdAt, updatedAt } = record;
    const validName = TagRenameModel.validName(name);

    return new TagRenameModel(id, validName, createdAt, updatedAt);
  }

  public rename(name: string): void {
    this._name = TagRenameModel.validName(name);
  }

  public toUpdatePayload(): ITagRenameUpdatePayload {
    return { id: this.id, name: this._name };
  }

  public toLoggerPayload(): ITagRenameLoggerPayload {
    return { id: this.id, name: this._name };
  }
}
