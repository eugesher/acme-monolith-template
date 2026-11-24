import { SelectQueryBuilder } from 'typeorm';

import type { TagSubject } from '@acme-staff/common/entities';

import type {
  ITagCommonFindSubjectIdsQuery,
  ITagCommonReplaceFindLinkedQuery,
} from '../../../outbound';

export class TagCommonPersistenceTagSubjectBuilder extends SelectQueryBuilder<TagSubject> {
  public forList(query: ITagCommonFindSubjectIdsQuery): this {
    const { subjectType, tagId } = query;

    this.select([`${this.alias}.tagId`, `${this.alias}.subjectType`, `${this.alias}.subjectId`])
      .where(`${this.alias}.tagId = :tagId`, { tagId })
      .andWhere(`${this.alias}.subjectType = :subjectType`, { subjectType });

    return this;
  }

  public forLinked(query: ITagCommonReplaceFindLinkedQuery): this {
    const { subjectType, subjectId } = query;

    this.select([`${this.alias}.tagId`, `${this.alias}.subjectType`, `${this.alias}.subjectId`])
      .where(`${this.alias}.subjectType = :subjectType`, { subjectType })
      .andWhere(`${this.alias}.subjectId = :subjectId`, { subjectId });

    return this;
  }
}
