import { Injectable, type ClassProvider } from '@nestjs/common';

import { TAG_DELETE_REPOSITORY_PORT, type ITagDeleteRepositoryPort } from '../../../outbound';
import { TagPersistenceHost } from '../host/tag-persistence.host';

@Injectable()
export class TagDeleteRepository extends TagPersistenceHost implements ITagDeleteRepositoryPort {
  public static readonly PROVIDER: ClassProvider<ITagDeleteRepositoryPort> = {
    provide: TAG_DELETE_REPOSITORY_PORT,
    useClass: TagDeleteRepository,
  };

  public async delete(tagId: string): Promise<void> {
    await this.tagRepository.delete({ id: tagId });
  }
}
