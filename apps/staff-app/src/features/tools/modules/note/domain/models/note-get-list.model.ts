import type { INoteGetListReconstitute, INoteGetListSnapshot } from '../types';

export class NoteGetListModel {
  private constructor(
    private readonly id: string,
    private readonly subjectType: string,
    private readonly subjectId: string,
    private readonly title: string,
    private readonly authorId: string,
    private readonly resolved: boolean,
    private readonly version: number,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  public static toViewData(records: INoteGetListReconstitute[]): INoteGetListSnapshot[] {
    return records.map((record) => {
      const note = NoteGetListModel.reconstitute(record);

      return note.toSnapshot();
    });
  }

  private static reconstitute(record: INoteGetListReconstitute): NoteGetListModel {
    const { id, subjectType, subjectId, title, authorId, resolved, version, createdAt, updatedAt } =
      record;

    return new NoteGetListModel(
      id,
      subjectType,
      subjectId,
      title,
      authorId,
      resolved,
      version,
      createdAt,
      updatedAt,
    );
  }

  private toSnapshot(): INoteGetListSnapshot {
    return {
      id: this.id,
      subjectType: this.subjectType,
      subjectId: this.subjectId,
      title: this.title,
      authorId: this.authorId,
      resolved: this.resolved,
      version: this.version,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
