import { NotePersistenceHost } from '../../host/note-persistence.host';
import type { INoteResolveUpdateQuery, INoteUpdateQuery } from '../../../../outbound';

export abstract class NoteBaseRepository extends NotePersistenceHost {
  public async update(query: INoteUpdateQuery | INoteResolveUpdateQuery): Promise<boolean> {
    const { id, versionAsRead, title, body, resolved, version } = query;
    const updateResult = await this.noteRepository.update(
      { id, version: versionAsRead },
      { title, body, resolved, version },
    );

    return updateResult.affected === 1;
  }
}
