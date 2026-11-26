import { NoteAggregate } from '../aggregates/note.aggregate';
import type { INoteDeleteLoggerPayload, INoteReconstitute } from '../types';

export class NoteDeleteModel extends NoteAggregate {
  public static reconstitute(this: void, record: INoteReconstitute): NoteDeleteModel {
    return new NoteDeleteModel(record);
  }

  public toLoggerPayload(): INoteDeleteLoggerPayload {
    return { id: this.id };
  }
}
