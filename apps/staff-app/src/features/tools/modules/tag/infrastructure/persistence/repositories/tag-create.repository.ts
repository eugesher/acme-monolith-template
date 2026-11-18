import { Injectable, type ClassProvider } from '@nestjs/common';

import { MysqlErrorHelper } from '@acme-libs/toolkit';

import {
  TAG_CREATE_REPOSITORY_PORT,
  TagCreateInsertOutcomeEnum,
  type ITagCreateInsertRecord,
  type ITagCreateQuery,
  type ITagCreateRecord,
  type ITagCreateRepositoryPort,
} from '../../../outbound';
import { TagPersistenceHost } from '../host/tag-persistence.host';

@Injectable()
export class TagCreateRepository extends TagPersistenceHost implements ITagCreateRepositoryPort {
  public static readonly provider: ClassProvider<ITagCreateRepositoryPort> = {
    provide: TAG_CREATE_REPOSITORY_PORT,
    useClass: TagCreateRepository,
  };

  public async insert(query: ITagCreateQuery): Promise<ITagCreateInsertRecord> {
    const tagId = await MysqlErrorHelper.catchDuplicateKey(() =>
      this.tagRepository.insertOne(query),
    );

    if (tagId === null) {
      return { outcome: TagCreateInsertOutcomeEnum.DUPLICATE };
    }

    return { outcome: TagCreateInsertOutcomeEnum.INSERTED, id: tagId };
  }

  public async findInserted(tagId: string): Promise<ITagCreateRecord> {
    return await this.createTagBuilder().forById(tagId).getOneOrFail();
  }
}
