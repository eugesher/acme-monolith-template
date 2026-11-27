import { NoteAggregate } from '../aggregates/note.aggregate';
import type { INoteReconstitute } from '../types';

export class NoteGetDetailsModel extends NoteAggregate {
  public static reconstitute(this: void, record: INoteReconstitute): NoteGetDetailsModel {
    return new NoteGetDetailsModel(record);
  }
}
