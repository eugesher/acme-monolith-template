import type { NoteEditModel } from '../../../domain';
import type { INoteWriteSaveCommand } from './note-write-save.command';

export interface INoteEditSaveCommand extends INoteWriteSaveCommand<NoteEditModel> {
  editorId: string;
}
