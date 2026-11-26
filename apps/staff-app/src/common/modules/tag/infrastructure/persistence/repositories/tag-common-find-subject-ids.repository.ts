import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  TAG_COMMON_FIND_SUBJECT_IDS_REPOSITORY_PORT,
  type ITagCommonFindSubjectIdsByTagQuery,
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

  public async findByTag(
    query: ITagCommonFindSubjectIdsByTagQuery,
  ): Promise<ITagCommonFindSubjectIdsRecord[]> {
    return await this.createTagSubjectBuilder().forTag(query).getMany();
  }
}
