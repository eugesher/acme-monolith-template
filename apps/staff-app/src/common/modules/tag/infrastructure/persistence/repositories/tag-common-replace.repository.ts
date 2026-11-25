import { Injectable, type ClassProvider } from '@nestjs/common';
import { In } from 'typeorm';

import {
  TAG_COMMON_REPLACE_REPOSITORY_PORT,
  type ITagCommonReplaceFindLinkedQuery,
  type ITagCommonReplaceLinkQuery,
  type ITagCommonReplaceRepositoryPort,
  type ITagCommonReplaceTagRecord,
  type ITagCommonReplaceTagSubjectRecord,
  type ITagCommonReplaceUnlinkQuery,
} from '../../../outbound';
import { TagCommonPersistenceHost } from '../host/tag-common-persistence.host';

@Injectable()
export class TagCommonReplaceRepository
  extends TagCommonPersistenceHost
  implements ITagCommonReplaceRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<ITagCommonReplaceRepositoryPort> = {
    provide: TAG_COMMON_REPLACE_REPOSITORY_PORT,
    useClass: TagCommonReplaceRepository,
  };

  public async lockMany(tagIds: string[]): Promise<ITagCommonReplaceTagRecord[]> {
    if (tagIds.length === 0) {
      return [];
    }

    return await this.createTagBuilder().forLockMany(tagIds).getMany();
  }

  public async findLinked(
    query: ITagCommonReplaceFindLinkedQuery,
  ): Promise<ITagCommonReplaceTagSubjectRecord[]> {
    return await this.createTagSubjectBuilder().forLinked(query).getMany();
  }

  public async link(query: ITagCommonReplaceLinkQuery): Promise<void> {
    const { subjectType, subjectId, tagIds } = query;

    if (tagIds.length === 0) {
      return;
    }

    const tagSubjectRows = tagIds.map((tagId) => ({ tagId, subjectType, subjectId }));

    await this.tagSubjectRepository.insert(tagSubjectRows);
  }

  public async unlink(query: ITagCommonReplaceUnlinkQuery): Promise<void> {
    const { subjectType, subjectId, tagIds } = query;

    if (tagIds.length === 0) {
      return;
    }

    await this.tagSubjectRepository.delete({ tagId: In(tagIds), subjectType, subjectId });
  }
}
