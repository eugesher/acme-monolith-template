import { SelectQueryBuilder } from 'typeorm';

import { TagSubject, type Tag } from '@acme-staff/common/entities';

import type { ITagCommonFindBySubjectQuery } from '../../../outbound';

export class TagCommonPersistenceBuilder extends SelectQueryBuilder<Tag> {
  private readonly tagSubjectAlias = TagSubject.name;

  public forSubject(query: ITagCommonFindBySubjectQuery): this {
    const { subjectType, subjectId } = query;

    this.selectTag()
      .innerJoin(
        TagSubject,
        this.tagSubjectAlias,
        `${this.tagSubjectAlias}.tagId = ${this.alias}.id`,
      )
      .where(`${this.tagSubjectAlias}.subjectType = :subjectType`, { subjectType })
      .andWhere(`${this.tagSubjectAlias}.subjectId = :subjectId`, { subjectId })
      .orderBy(`${this.alias}.name`, 'ASC');

    return this;
  }

  public forLockMany(tagIds: string[]): this {
    this.selectTag()
      .where(`${this.alias}.id IN (:...tagIds)`, { tagIds })
      .orderBy(`${this.alias}.name`, 'ASC')
      .setLock('pessimistic_read');

    return this;
  }

  private selectTag(): this {
    this.select([`${this.alias}.id`, `${this.alias}.name`]);

    return this;
  }
}
