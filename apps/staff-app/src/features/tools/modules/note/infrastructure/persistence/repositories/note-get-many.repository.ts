import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  NOTE_GET_MANY_REPOSITORY_PORT,
  type INoteGetManyListQuery,
  type INoteGetManyRecord,
  type INoteGetManyRepositoryPort,
} from '../../../outbound';
import { NotePersistenceHost } from '../host/note-persistence.host';

@Injectable()
export class NoteGetManyRepository
  extends NotePersistenceHost
  implements INoteGetManyRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<INoteGetManyRepositoryPort> = {
    provide: NOTE_GET_MANY_REPOSITORY_PORT,
    useClass: NoteGetManyRepository,
  };

  public async list(query: INoteGetManyListQuery): Promise<INoteGetManyRecord> {
    return await this.createNoteBuilder().forList(query).getManyAndCount();
  }
}
