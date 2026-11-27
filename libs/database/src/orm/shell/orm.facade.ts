import { Injectable } from '@nestjs/common';
import type { EntityTarget, ObjectLiteral } from 'typeorm';

import type { IHostedRepository, IOrmPort } from '@acme-libs/contracts/database';

import { OrmGetRepositoryCase } from '../application';

@Injectable()
export class OrmFacade implements IOrmPort {
  constructor(private readonly getRepositoryCase: OrmGetRepositoryCase) {}

  public getRepository<Entity extends ObjectLiteral>(
    entity: EntityTarget<Entity>,
  ): IHostedRepository<Entity> {
    return this.getRepositoryCase.execute(entity);
  }
}
