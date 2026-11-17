import type { NoteEditModel } from '../../../domain';

export interface INoteEditSaveCommand {
  note: NoteEditModel;
  versionAsRead: number;
  bodyBefore: string;
  editorId: string;
}
