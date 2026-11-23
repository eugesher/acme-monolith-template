import type { NoteAggregate } from '../../../domain';

export interface INoteWriteSaveCommand<TNote extends NoteAggregate> {
  note: TNote;
  versionAsRead: number;
}
