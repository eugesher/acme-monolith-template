import { Injectable, type ClassProvider } from '@nestjs/common';

import { MysqlErrorHelper } from '@acme-libs/toolkit';

import {
  TAG_RENAME_REPOSITORY_PORT,
  TagRenameUpdateOutcomeEnum,
  type ITagRenameQuery,
  type ITagRenameRepositoryPort,
} from '../../../outbound';
import { TagPersistenceHost } from '../host/tag-persistence.host';

@Injectable()
export class TagRenameRepository extends TagPersistenceHost implements ITagRenameRepositoryPort {
  public static readonly PROVIDER: ClassProvider<ITagRenameRepositoryPort> = {
    provide: TAG_RENAME_REPOSITORY_PORT,
    useClass: TagRenameRepository,
  };

  public async update(query: ITagRenameQuery): Promise<TagRenameUpdateOutcomeEnum> {
    const { id, name } = query;

    const updateResult = await MysqlErrorHelper.catchDuplicateKey(() =>
      this.tagRepository.update({ id }, { name }),
    );

    if (updateResult === null) {
      return TagRenameUpdateOutcomeEnum.DUPLICATE;
    }

    return TagRenameUpdateOutcomeEnum.UPDATED;
  }
}
