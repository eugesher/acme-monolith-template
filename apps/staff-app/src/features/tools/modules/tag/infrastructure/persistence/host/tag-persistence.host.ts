import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { Tag } from '@acme-staff/common/entities';

import { TagPersistenceBuilder } from '../builders/tag-persistence.builder';

export abstract class TagPersistenceHost {
  protected get tagRepository(): IHostedRepository<Tag> {
    return this.orm.getRepository(Tag);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createTagBuilder(): TagPersistenceBuilder {
    return new TagPersistenceBuilder(this.tagRepository.createQueryBuilder(Tag.name));
  }
}
