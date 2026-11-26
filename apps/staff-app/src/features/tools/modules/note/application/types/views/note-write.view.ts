import type { NoteAggregate } from '../../../domain';

export interface INoteWriteView<TNote extends NoteAggregate, TAnswer> {
  note: TNote;
  answer: TAnswer;
}
