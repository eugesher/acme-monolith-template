import { TagAggregate } from '../aggregates/tag.aggregate';
import type { ITagDeleteLoggerPayload, ITagReconstitute } from '../types';

export class TagDeleteModel extends TagAggregate {
  public static reconstitute(this: void, record: ITagReconstitute): TagDeleteModel {
    const { id, name, createdAt, updatedAt } = record;
    const validName = TagDeleteModel.validName(name);

    return new TagDeleteModel(id, validName, createdAt, updatedAt);
  }

  public toLoggerPayload(): ITagDeleteLoggerPayload {
    return { id: this.id };
  }
}
