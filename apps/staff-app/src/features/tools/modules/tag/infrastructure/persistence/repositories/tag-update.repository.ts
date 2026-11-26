import { Injectable, type ClassProvider } from '@nestjs/common';

import { MysqlErrorHelper } from '@acme-libs/toolkit';

import {
  TAG_UPDATE_REPOSITORY_PORT,
  TagUpdateOutcomeEnum,
  type ITagUpdateQuery,
  type ITagUpdateRepositoryPort,
} from '../../../outbound';
import { TagPersistenceHost } from '../host/tag-persistence.host';

@Injectable()
export class TagUpdateRepository extends TagPersistenceHost implements ITagUpdateRepositoryPort {
  public static readonly PROVIDER: ClassProvider<ITagUpdateRepositoryPort> = {
    provide: TAG_UPDATE_REPOSITORY_PORT,
    useClass: TagUpdateRepository,
  };

  public async update(query: ITagUpdateQuery): Promise<TagUpdateOutcomeEnum> {
    const { id, name } = query;

    const updateResult = await MysqlErrorHelper.catchDuplicateKey(() =>
      this.tagRepository.update({ id }, { name }),
    );

    if (updateResult === null) {
      return TagUpdateOutcomeEnum.DUPLICATE;
    }

    return TagUpdateOutcomeEnum.UPDATED;
  }
}
