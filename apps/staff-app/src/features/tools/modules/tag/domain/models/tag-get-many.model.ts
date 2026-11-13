import type { ITagGetManyReconstitute, ITagGetManySnapshot } from '../interfaces';

export class TagGetManyModel {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public static reconstitute(record: ITagGetManyReconstitute): TagGetManyModel {
    const { id, name, createdAt, updatedAt } = record;

    return new TagGetManyModel(id, name, createdAt, updatedAt);
  }

  public static toViewData(records: ITagGetManyReconstitute[]): ITagGetManySnapshot[] {
    return records.map((record) => {
      const tag = TagGetManyModel.reconstitute(record);

      return tag.toSnapshot();
    });
  }

  private toSnapshot(): ITagGetManySnapshot {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
