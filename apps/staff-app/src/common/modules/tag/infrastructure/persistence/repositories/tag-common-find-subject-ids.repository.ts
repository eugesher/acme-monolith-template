import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  TAG_COMMON_FIND_SUBJECT_IDS_REPOSITORY_PORT,
  type ITagCommonFindSubjectIdsQuery,
  type ITagCommonFindSubjectIdsRecord,
  type ITagCommonFindSubjectIdsRepositoryPort,
} from '../../../outbound';
import { TagCommonPersistenceHost } from '../host/tag-common-persistence.host';

@Injectable()
export class TagCommonFindSubjectIdsRepository
  extends TagCommonPersistenceHost
  implements ITagCommonFindSubjectIdsRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<ITagCommonFindSubjectIdsRepositoryPort> = {
    provide: TAG_COMMON_FIND_SUBJECT_IDS_REPOSITORY_PORT,
    useClass: TagCommonFindSubjectIdsRepository,
  };

  public async list(
    query: ITagCommonFindSubjectIdsQuery,
  ): Promise<ITagCommonFindSubjectIdsRecord[]> {
    return await this.createSubjectTagBuilder().forList(query).getMany();
  }
}
