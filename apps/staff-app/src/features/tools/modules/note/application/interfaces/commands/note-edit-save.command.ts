import type { NoteModel } from '../../../domain';

export interface INoteEditSaveCommand {
  note: NoteModel;
  versionAsRead: number;
  bodyBefore: string;
  editorId: string;
}
