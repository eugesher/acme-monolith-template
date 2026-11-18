import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { IdempotencyKey } from '@acme-core/entities';

export abstract class IdempotencyPersistenceHost {
  protected get idempotencyKeyRepository(): IHostedRepository<IdempotencyKey> {
    return this.orm.getRepository(IdempotencyKey);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}
}
