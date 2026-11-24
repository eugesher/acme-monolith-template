import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { Tag, TagSubject } from '@acme-staff/common/entities';

import { TagCommonPersistenceTagSubjectBuilder } from '../builders/tag-common-persistence-tag-subject.builder';
import { TagCommonPersistenceBuilder } from '../builders/tag-common-persistence.builder';

export abstract class TagCommonPersistenceHost {
  protected get tagSubjectRepository(): IHostedRepository<TagSubject> {
    return this.orm.getRepository(TagSubject);
  }

  protected get tagRepository(): IHostedRepository<Tag> {
    return this.orm.getRepository(Tag);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createTagBuilder(): TagCommonPersistenceBuilder {
    return new TagCommonPersistenceBuilder(this.tagRepository.createQueryBuilder(Tag.name));
  }

  protected createTagSubjectBuilder(): TagCommonPersistenceTagSubjectBuilder {
    return new TagCommonPersistenceTagSubjectBuilder(
      this.tagSubjectRepository.createQueryBuilder(TagSubject.name),
    );
  }
}
