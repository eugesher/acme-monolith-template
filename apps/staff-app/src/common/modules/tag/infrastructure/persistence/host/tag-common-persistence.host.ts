import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { SubjectTag, Tag } from '@acme-staff/common/entities';

import { TagCommonPersistenceSubjectTagBuilder } from '../builders/tag-common-persistence-subject-tag.builder';
import { TagCommonPersistenceBuilder } from '../builders/tag-common-persistence.builder';

export abstract class TagCommonPersistenceHost {
  protected get subjectTagRepository(): IHostedRepository<SubjectTag> {
    return this.orm.getRepository(SubjectTag);
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

  protected createSubjectTagBuilder(): TagCommonPersistenceSubjectTagBuilder {
    return new TagCommonPersistenceSubjectTagBuilder(
      this.subjectTagRepository.createQueryBuilder(SubjectTag.name),
    );
  }
}
