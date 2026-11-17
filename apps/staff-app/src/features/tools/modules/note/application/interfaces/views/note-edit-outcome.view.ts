import type { NoteEditModel } from '../../../domain';

export interface INoteEditOutcomeView {
  note: NoteEditModel;
  edited: boolean;
}
