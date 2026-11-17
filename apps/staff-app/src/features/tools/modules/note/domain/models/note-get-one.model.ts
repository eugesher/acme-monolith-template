import { NoteAggregate } from '../aggregates/note.aggregate';
import type { INoteReconstitute } from '../interfaces';

export class NoteGetOneModel extends NoteAggregate {
  public static reconstitute(this: void, record: INoteReconstitute): NoteGetOneModel {
    return new NoteGetOneModel(record);
  }
}
