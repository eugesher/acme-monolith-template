import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  NOTE_GET_REVISIONS_REPOSITORY_PORT,
  type INoteGetRevisionsListQuery,
  type INoteGetRevisionsRecord,
  type INoteGetRevisionsRepositoryPort,
} from '../../../outbound';
import { NotePersistenceHost } from '../host/note-persistence.host';

@Injectable()
export class NoteGetRevisionsRepository
  extends NotePersistenceHost
  implements INoteGetRevisionsRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<INoteGetRevisionsRepositoryPort> = {
    provide: NOTE_GET_REVISIONS_REPOSITORY_PORT,
    useClass: NoteGetRevisionsRepository,
  };

  public async list(query: INoteGetRevisionsListQuery): Promise<INoteGetRevisionsRecord> {
    return await this.createNoteRevisionBuilder().forList(query).getManyAndCount();
  }
}
