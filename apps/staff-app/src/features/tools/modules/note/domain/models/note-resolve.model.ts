import { NoteAggregate } from '../aggregates/note.aggregate';
import type { INoteReconstitute, INoteResolveLoggerPayload } from '../interfaces';

export class NoteResolveModel extends NoteAggregate {
  public static reconstitute(this: void, record: INoteReconstitute): NoteResolveModel {
    return new NoteResolveModel(record);
  }

  public resolve(): void {
    this.assertOpen();

    this.currentResolved = true;
    this.bumpVersion();
  }

  public toLoggerPayload(): INoteResolveLoggerPayload {
    return { id: this.id, version: this.version };
  }
}
