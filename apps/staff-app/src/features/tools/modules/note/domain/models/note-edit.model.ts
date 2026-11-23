import { NoteAggregate } from '../aggregates/note.aggregate';
import type {
  INoteEditLoggerPayload,
  INoteEditRevisionInsertPayload,
  INoteEditRevisionInsertPayloadBuild,
  INoteReconstitute,
} from '../types';

export class NoteEditModel extends NoteAggregate {
  private readonly bodyAsRead: string;

  protected constructor(record: INoteReconstitute) {
    super(record);
    this.bodyAsRead = this.body;
  }

  public static reconstitute(this: void, record: INoteReconstitute): NoteEditModel {
    return new NoteEditModel(record);
  }

  public edit(body: string): boolean {
    this.assertOpen();

    const validBody = NoteEditModel.validBody(body);

    if (validBody === this.body) {
      return false;
    }

    this.body = validBody;
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
      bodyAfter: this.body,
      editorId,
      correlationId,
    };
  }

  public toLoggerPayload(): INoteEditLoggerPayload {
    return { id: this.id, authorId: this.authorId, version: this.version };
  }
}
