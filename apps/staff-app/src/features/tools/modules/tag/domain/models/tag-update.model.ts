import { TagAggregate } from '../aggregates/tag.aggregate';
import type { ITagReconstitute, ITagUpdateLoggerPayload, ITagUpdatePayload } from '../types';

export class TagUpdateModel extends TagAggregate {
  public get name(): string {
    return this._name;
  }

  public static reconstitute(this: void, record: ITagReconstitute): TagUpdateModel {
    const { id, name, createdAt, updatedAt } = record;
    const validName = TagUpdateModel.validName(name);

    return new TagUpdateModel(id, validName, createdAt, updatedAt);
  }

  public update(name: string): void {
    this._name = TagUpdateModel.validName(name);
  }

  public toUpdatePayload(): ITagUpdatePayload {
    return { id: this.id, name: this._name };
  }

  public toLoggerPayload(): ITagUpdateLoggerPayload {
    return { id: this.id, name: this._name };
  }
}
