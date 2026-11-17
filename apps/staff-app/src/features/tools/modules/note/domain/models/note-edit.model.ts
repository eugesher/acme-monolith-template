import { NoteAggregate } from '../aggregates/note.aggregate';
import type {
  INoteEditLoggerPayload,
  INoteEditRevisionInsertPayload,
  INoteEditRevisionInsertPayloadBuild,
  INoteReconstitute,
} from '../interfaces';

export class NoteEditModel extends NoteAggregate {
  public get body(): string {
    return this.currentBody;
  }

  public static reconstitute(this: void, record: INoteReconstitute): NoteEditModel {
    return new NoteEditModel(record);
  }

  public edit(body: string): void {
    this.assertOpen();

    const validBody = NoteEditModel.validBody(body);

    if (validBody === this.currentBody) {
      return;
    }

    this.currentBody = validBody;
    this.currentVersion += 1;
  }

  public toRevisionInsertPayload(
    params: INoteEditRevisionInsertPayloadBuild,
  ): INoteEditRevisionInsertPayload {
    const { bodyBefore, editorId, correlationId } = params;

    return {
      noteId: this.id,
      noteVersion: this.currentVersion,
      bodyBefore,
      bodyAfter: this.currentBody,
      editorId,
      correlationId,
    };
  }

  public toLoggerPayload(): INoteEditLoggerPayload {
    return { id: this.id, authorId: this.authorId, version: this.currentVersion };
  }
}
