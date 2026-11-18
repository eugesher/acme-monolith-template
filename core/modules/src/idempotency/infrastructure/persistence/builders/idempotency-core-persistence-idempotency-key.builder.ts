import { SelectQueryBuilder } from 'typeorm';

import type { IdempotencyKey } from '@acme-core/entities';

import type { IIdempotencyCoreClaimFindQuery } from '../../../outbound';

export class IdempotencyCorePersistenceIdempotencyKeyBuilder extends SelectQueryBuilder<IdempotencyKey> {
  public forByKey(query: IIdempotencyCoreClaimFindQuery): this {
    const { scope, key } = query;

    this.select([
      `${this.alias}.id`,
      `${this.alias}.requestFingerprint`,
      `${this.alias}.status`,
      `${this.alias}.responseBody`,
    ])
      .where(`${this.alias}.scope = :scope`, { scope })
      .andWhere(`${this.alias}.idempotencyKey = :key`, { key });

    return this;
  }
}
