import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import { ORM_PORT, type IOrmPort } from '@acme-libs/contracts/database';

import { NOTE_DELETE_REPOSITORY_PORT, type INoteDeleteRepositoryPort } from '../../../outbound';
import { NotePersistenceHost } from '../host/note-persistence.host';

@Injectable()
export class NoteDeleteRepository extends NotePersistenceHost implements INoteDeleteRepositoryPort {
  public static readonly provider: ClassProvider<INoteDeleteRepositoryPort> = {
    provide: NOTE_DELETE_REPOSITORY_PORT,
    useClass: NoteDeleteRepository,
  };

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {
    super();
  }

  public async softDelete(noteId: string): Promise<void> {
    await this.noteRepository.softDelete({ id: noteId });
  }
}
