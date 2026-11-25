import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  TAG_COMMON_FIND_REPOSITORY_PORT,
  type ITagCommonFindBySubjectQuery,
  type ITagCommonFindRecord,
  type ITagCommonFindRepositoryPort,
} from '../../../outbound';
import { TagCommonPersistenceHost } from '../host/tag-common-persistence.host';

@Injectable()
export class TagCommonFindRepository
  extends TagCommonPersistenceHost
  implements ITagCommonFindRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<ITagCommonFindRepositoryPort> = {
    provide: TAG_COMMON_FIND_REPOSITORY_PORT,
    useClass: TagCommonFindRepository,
  };

  public async findBySubject(query: ITagCommonFindBySubjectQuery): Promise<ITagCommonFindRecord[]> {
    return await this.createTagBuilder().forSubject(query).getMany();
  }
}
