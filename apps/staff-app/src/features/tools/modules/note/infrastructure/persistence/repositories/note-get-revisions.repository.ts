import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  NOTE_GET_REVISIONS_REPOSITORY_PORT,
  type INoteGetRevisionsListForNoteQuery,
  type INoteGetRevisionsRecord,
  type INoteGetRevisionsRepositoryPort,
} from '../../../outbound';
import { NotePersistenceHost } from '../host/note-persistence.host';

@Injectable()
export class NoteGetRevisionsRepository
  extends NotePersistenceHost
  implements INoteGetRevisionsRepositoryPort
{
  public static readonly provider: ClassProvider<INoteGetRevisionsRepositoryPort> = {
    provide: NOTE_GET_REVISIONS_REPOSITORY_PORT,
    useClass: NoteGetRevisionsRepository,
  };

  public async listForNote(
    query: INoteGetRevisionsListForNoteQuery,
  ): Promise<INoteGetRevisionsRecord> {
    return await this.createNoteRevisionBuilder().forListForNote(query).getManyAndCount();
  }
}
