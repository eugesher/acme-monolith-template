import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  NOTE_UPDATE_REPOSITORY_PORT,
  type INoteUpdateAppendRevisionQuery,
  type INoteUpdateRepositoryPort,
} from '../../../outbound';
import { NoteBaseRepository } from './base/note-base.repository';

@Injectable()
export class NoteUpdateRepository extends NoteBaseRepository implements INoteUpdateRepositoryPort {
  public static readonly PROVIDER: ClassProvider<INoteUpdateRepositoryPort> = {
    provide: NOTE_UPDATE_REPOSITORY_PORT,
    useClass: NoteUpdateRepository,
  };

  public async appendRevision(query: INoteUpdateAppendRevisionQuery): Promise<void> {
    await this.noteRevisionRepository.insert(query);
  }
}
