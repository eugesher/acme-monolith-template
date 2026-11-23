import { Injectable, type ClassProvider } from '@nestjs/common';

import { NOTE_DELETE_REPOSITORY_PORT, type INoteDeleteRepositoryPort } from '../../../outbound';
import { NotePersistenceHost } from '../host/note-persistence.host';

@Injectable()
export class NoteDeleteRepository extends NotePersistenceHost implements INoteDeleteRepositoryPort {
  public static readonly PROVIDER: ClassProvider<INoteDeleteRepositoryPort> = {
    provide: NOTE_DELETE_REPOSITORY_PORT,
    useClass: NoteDeleteRepository,
  };

  public async softDelete(noteId: string): Promise<void> {
    await this.noteRepository.softDelete({ id: noteId });
  }
}
