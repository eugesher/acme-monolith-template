import { NoteAggregate } from '../aggregates/note.aggregate';
import type {
  INoteEditLoggerPayload,
  INoteEditRevisionInsertPayload,
  INoteEditRevisionInsertPayloadBuild,
  INoteReconstitute,
} from '../interfaces';

export class NoteEditModel extends NoteAggregate {
  private readonly bodyAsRead: string;

  protected constructor(record: INoteReconstitute) {
    super(record);
    this.bodyAsRead = this.currentBody;
  }

  public static reconstitute(this: void, record: INoteReconstitute): NoteEditModel {
    return new NoteEditModel(record);
  }

  public edit(body: string): boolean {
    this.assertOpen();

    const validBody = NoteEditModel.validBody(body);

    if (validBody === this.currentBody) {
      return false;
    }

    this.currentBody = validBody;
    this.bumpVersion();

    return true;
  }

  public toRevisionInsertPayload(
    params: INoteEditRevisionInsertPayloadBuild,
  ): INoteEditRevisionInsertPayload {
    const { editorId, correlationId } = params;

    return {
      noteId: this.id,
      noteVersion: this.version,
      bodyBefore: this.bodyAsRead,
      bodyAfter: this.currentBody,
      editorId,
      correlationId,
    };
  }

  public toLoggerPayload(): INoteEditLoggerPayload {
    return { id: this.id, authorId: this.authorId, version: this.version };
  }
}
