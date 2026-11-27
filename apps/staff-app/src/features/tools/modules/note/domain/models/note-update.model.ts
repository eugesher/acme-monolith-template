import type { Maybe } from '@acme-libs/toolkit';

import { NoteAggregate } from '../aggregates/note.aggregate';
import type {
  INoteReconstitute,
  INoteUpdateLoggerPayload,
  INoteUpdateRevisionInsertPayload,
  INoteUpdateRevisionInsertPayloadBuild,
} from '../types';

export class NoteUpdateModel extends NoteAggregate {
  private readonly titleAsRead: string;
  private readonly bodyAsRead: string;

  protected constructor(record: INoteReconstitute) {
    super(record);
    this.titleAsRead = this.title;
    this.bodyAsRead = this.body;
  }

  public static reconstitute(this: void, record: INoteReconstitute): NoteUpdateModel {
    return new NoteUpdateModel(record);
  }

  public update(body: string, title: Maybe<string>): boolean {
    this.assertOpen();

    const validBody = NoteUpdateModel.validBody(body);
    const trimmedTitle = title?.trim() ?? '';
    const validTitle =
      trimmedTitle.length === 0 ? this.title : NoteUpdateModel.validTitle(trimmedTitle);

    if (validBody === this.body && validTitle === this.title) {
      return false;
    }

    this.title = validTitle;
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
      titleBefore: this.titleAsRead,
      titleAfter: this.title,
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
