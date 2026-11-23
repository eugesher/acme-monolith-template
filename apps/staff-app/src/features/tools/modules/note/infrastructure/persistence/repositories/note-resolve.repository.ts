import { Injectable, type ClassProvider } from '@nestjs/common';

import { NOTE_RESOLVE_REPOSITORY_PORT, type INoteResolveRepositoryPort } from '../../../outbound';
import { NoteBaseRepository } from './base/note-base.repository';

@Injectable()
export class NoteResolveRepository
  extends NoteBaseRepository
  implements INoteResolveRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<INoteResolveRepositoryPort> = {
    provide: NOTE_RESOLVE_REPOSITORY_PORT,
    useClass: NoteResolveRepository,
  };
}
