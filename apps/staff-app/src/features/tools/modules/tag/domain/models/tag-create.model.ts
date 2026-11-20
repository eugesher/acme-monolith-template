import { TagAggregate } from '../aggregates/tag.aggregate';
import type {
  ITagCreateCandidate,
  ITagCreateCandidateInit,
  ITagCreateLoggerPayload,
  ITagReconstitute,
} from '../interfaces';

export class TagCreateModel extends TagAggregate {
  public static initCandidate(proposal: ITagCreateCandidateInit): ITagCreateCandidate {
    const { name } = proposal;
    const validName = TagCreateModel.validName(name);

    return { name: validName };
  }

  public static reconstitute(this: void, record: ITagReconstitute): TagCreateModel {
    const { id, name, createdAt, updatedAt } = record;
    const validName = TagCreateModel.validName(name);

    return new TagCreateModel(id, validName, createdAt, updatedAt);
  }

  public toLoggerPayload(): ITagCreateLoggerPayload {
    return { id: this.id, name: this._name };
  }
}
