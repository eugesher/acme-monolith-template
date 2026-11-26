import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { IdempotencyKey } from '@acme-core/entities';

import { IdempotencyCorePersistenceIdempotencyKeyBuilder } from '../builders/idempotency-core-persistence-idempotency-key.builder';

export abstract class IdempotencyCorePersistenceHost {
  protected get idempotencyKeyRepository(): IHostedRepository<IdempotencyKey> {
    return this.orm.getRepository(IdempotencyKey);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createIdempotencyKeyBuilder(): IdempotencyCorePersistenceIdempotencyKeyBuilder {
    return new IdempotencyCorePersistenceIdempotencyKeyBuilder(
      this.idempotencyKeyRepository.createQueryBuilder(IdempotencyKey.name),
    );
  }
}
