import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  NOTE_EDIT_REPOSITORY_PORT,
  type INoteEditRepositoryPort,
  type INoteEditRevisionInsertQuery,
} from '../../../outbound';
import { NoteBaseRepository } from './base/note-base.repository';

@Injectable()
export class NoteEditRepository extends NoteBaseRepository implements INoteEditRepositoryPort {
  public static readonly PROVIDER: ClassProvider<INoteEditRepositoryPort> = {
    provide: NOTE_EDIT_REPOSITORY_PORT,
    useClass: NoteEditRepository,
  };

  public async appendRevision(query: INoteEditRevisionInsertQuery): Promise<void> {
    await this.noteRevisionRepository.insert(query);
  }
}
