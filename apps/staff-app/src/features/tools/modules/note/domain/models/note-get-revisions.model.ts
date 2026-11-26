import type { INoteGetRevisionsReconstitute, INoteGetRevisionsSnapshot } from '../types';

export class NoteGetRevisionsModel {
  private constructor(
    private readonly id: string,
    private readonly noteId: string,
    private readonly noteVersion: number,
    private readonly bodyBefore: string,
    private readonly bodyAfter: string,
    private readonly editorId: string,
    private readonly correlationId: string,
    private readonly recordedAt: Date,
  ) {}

  public static toViewData(records: INoteGetRevisionsReconstitute[]): INoteGetRevisionsSnapshot[] {
    return records.map((record) => {
      const revision = NoteGetRevisionsModel.reconstitute(record);

      return revision.toSnapshot();
    });
  }

  private static reconstitute(record: INoteGetRevisionsReconstitute): NoteGetRevisionsModel {
    const { id, noteId, noteVersion, bodyBefore, bodyAfter, editorId, correlationId, recordedAt } =
      record;

    return new NoteGetRevisionsModel(
      id,
      noteId,
      noteVersion,
      bodyBefore,
      bodyAfter,
      editorId,
      correlationId,
      recordedAt,
    );
  }

  private toSnapshot(): INoteGetRevisionsSnapshot {
    return {
      id: this.id,
      noteId: this.noteId,
      noteVersion: this.noteVersion,
      bodyBefore: this.bodyBefore,
      bodyAfter: this.bodyAfter,
      editorId: this.editorId,
      correlationId: this.correlationId,
      recordedAt: this.recordedAt.toISOString(),
    };
  }
}
