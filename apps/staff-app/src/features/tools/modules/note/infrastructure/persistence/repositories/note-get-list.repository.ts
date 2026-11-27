import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  NOTE_GET_LIST_REPOSITORY_PORT,
  type INoteGetListQuery,
  type INoteGetListRecord,
  type INoteGetListRepositoryPort,
} from '../../../outbound';
import { NotePersistenceHost } from '../host/note-persistence.host';

@Injectable()
export class NoteGetListRepository
  extends NotePersistenceHost
  implements INoteGetListRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<INoteGetListRepositoryPort> = {
    provide: NOTE_GET_LIST_REPOSITORY_PORT,
    useClass: NoteGetListRepository,
  };

  public async list(query: INoteGetListQuery): Promise<INoteGetListRecord> {
    return await this.createNoteBuilder().forList(query).getManyAndCount();
  }
}
