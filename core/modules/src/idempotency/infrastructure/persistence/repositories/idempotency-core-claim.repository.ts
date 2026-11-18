import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import { MysqlErrorHelper, type Nullable } from '@acme-libs/toolkit';
import { ORM_PORT, type IOrmPort } from '@acme-libs/contracts/database';

import {
  IDEMPOTENCY_CORE_CLAIM_REPOSITORY_PORT,
  IdempotencyCoreClaimInsertOutcomeEnum,
  type IIdempotencyCoreClaimFindQuery,
  type IIdempotencyCoreClaimInsertQuery,
  type IIdempotencyCoreClaimRecord,
  type IIdempotencyCoreClaimRepositoryPort,
} from '../../../outbound';
import { IdempotencyCorePersistenceHost } from '../host/idempotency-core-persistence.host';

@Injectable()
export class IdempotencyCoreClaimRepository
  extends IdempotencyCorePersistenceHost
  implements IIdempotencyCoreClaimRepositoryPort
{
  public static readonly provider: ClassProvider<IIdempotencyCoreClaimRepositoryPort> = {
    provide: IDEMPOTENCY_CORE_CLAIM_REPOSITORY_PORT,
    useClass: IdempotencyCoreClaimRepository,
  };

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {
    super();
  }

  public async insert(
    query: IIdempotencyCoreClaimInsertQuery,
  ): Promise<IdempotencyCoreClaimInsertOutcomeEnum> {
    const insertResult = await MysqlErrorHelper.catchDuplicateKey(() =>
      this.idempotencyKeyRepository.insert(query),
    );

    if (insertResult === null) {
      return IdempotencyCoreClaimInsertOutcomeEnum.DUPLICATE;
    }

    return IdempotencyCoreClaimInsertOutcomeEnum.INSERTED;
  }

  public async findByKey(
    query: IIdempotencyCoreClaimFindQuery,
  ): Promise<Nullable<IIdempotencyCoreClaimRecord>> {
    const { scope, key } = query;

    return await this.createIdempotencyKeyBuilder().forByKey(scope, key).getOne();
  }
}
