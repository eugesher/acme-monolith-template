import { Injectable, type ClassProvider } from '@nestjs/common';

import { MysqlErrorHelper, type Nullable } from '@acme-libs/toolkit';

import {
  IDEMPOTENCY_CORE_CLAIM_REPOSITORY_PORT,
  IdempotencyCoreClaimInsertOutcomeEnum,
  type IIdempotencyCoreClaimFindByKeyQuery,
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
  public static readonly PROVIDER: ClassProvider<IIdempotencyCoreClaimRepositoryPort> = {
    provide: IDEMPOTENCY_CORE_CLAIM_REPOSITORY_PORT,
    useClass: IdempotencyCoreClaimRepository,
  };

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
    query: IIdempotencyCoreClaimFindByKeyQuery,
  ): Promise<Nullable<IIdempotencyCoreClaimRecord>> {
    return await this.createIdempotencyKeyBuilder().forKey(query).getOne();
  }
}
