import { NoteAggregate } from '../aggregates/note.aggregate';
import type { INoteReconstitute, INoteResolveLoggerPayload } from '../types';

export class NoteResolveModel extends NoteAggregate {
  public static reconstitute(this: void, record: INoteReconstitute): NoteResolveModel {
    return new NoteResolveModel(record);
  }

  public resolve(): void {
    this.assertOpen();

    this.resolved = true;
    this.bumpVersion();
  }

  public toLoggerPayload(): INoteResolveLoggerPayload {
    return { id: this.id, version: this.version };
  }
}
