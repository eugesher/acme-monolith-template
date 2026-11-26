import type { ITagGetManyReconstitute, ITagGetManySnapshot } from '../types';

export class TagGetManyModel {
  private constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  public static toViewData(records: ITagGetManyReconstitute[]): ITagGetManySnapshot[] {
    return records.map((record) => {
      const tag = TagGetManyModel.reconstitute(record);

      return tag.toSnapshot();
    });
  }

  private static reconstitute(record: ITagGetManyReconstitute): TagGetManyModel {
    const { id, name, createdAt, updatedAt } = record;

    return new TagGetManyModel(id, name, createdAt, updatedAt);
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
