import type { NoteUpdateModel } from '../../../domain';
import type { INoteWriteSaveCommand } from './note-write-save.command';

export interface INoteUpdateSaveCommand extends INoteWriteSaveCommand<NoteUpdateModel> {
  editorId: string;
}
