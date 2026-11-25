import { NoteAggregate } from '../aggregates/note.aggregate';
import type {
  INoteReconstitute,
  INoteUpdateLoggerPayload,
  INoteUpdateRevisionInsertPayload,
  INoteUpdateRevisionInsertPayloadBuild,
} from '../types';

export class NoteUpdateModel extends NoteAggregate {
  private readonly bodyAsRead: string;

  protected constructor(record: INoteReconstitute) {
    super(record);
    this.bodyAsRead = this.body;
  }

  public static reconstitute(this: void, record: INoteReconstitute): NoteUpdateModel {
    return new NoteUpdateModel(record);
  }

  public update(body: string): boolean {
    this.assertOpen();

    const validBody = NoteUpdateModel.validBody(body);

    if (validBody === this.body) {
      return false;
    }

    this.body = validBody;
    this.bumpVersion();

    return true;
  }

  public toRevisionInsertPayload(
    params: INoteUpdateRevisionInsertPayloadBuild,
  ): INoteUpdateRevisionInsertPayload {
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

  public toLoggerPayload(): INoteUpdateLoggerPayload {
    return { id: this.id, authorId: this.authorId, version: this.version };
  }
}
