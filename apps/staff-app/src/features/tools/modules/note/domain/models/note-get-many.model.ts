import type { INoteGetManyReconstitute, INoteGetManySnapshot } from '../interfaces';

export class NoteGetManyModel {
  private constructor(
    private readonly id: string,
    private readonly subjectType: string,
    private readonly subjectId: string,
    private readonly body: string,
    private readonly authorId: string,
    private readonly resolved: boolean,
    private readonly version: number,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  public static toViewData(records: INoteGetManyReconstitute[]): INoteGetManySnapshot[] {
    return records.map((record) => {
      const note = NoteGetManyModel.reconstitute(record);

      return note.toSnapshot();
    });
  }

  private static reconstitute(record: INoteGetManyReconstitute): NoteGetManyModel {
    const { id, subjectType, subjectId, body, authorId, resolved, version, createdAt, updatedAt } =
      record;

    return new NoteGetManyModel(
      id,
      subjectType,
      subjectId,
      body,
      authorId,
      resolved,
      version,
      createdAt,
      updatedAt,
    );
  }

  private toSnapshot(): INoteGetManySnapshot {
    return {
      id: this.id,
      subjectType: this.subjectType,
      subjectId: this.subjectId,
      body: this.body,
      authorId: this.authorId,
      resolved: this.resolved,
      version: this.version,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
