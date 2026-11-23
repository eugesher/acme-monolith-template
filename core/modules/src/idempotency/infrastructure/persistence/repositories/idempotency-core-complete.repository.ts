import { Injectable, type ClassProvider } from '@nestjs/common';

import { IdempotencyStatusEnum } from '@acme-libs/kernel';

import {
  IDEMPOTENCY_CORE_COMPLETE_REPOSITORY_PORT,
  type IIdempotencyCoreCompleteQuery,
  type IIdempotencyCoreCompleteRepositoryPort,
} from '../../../outbound';
import { IdempotencyCorePersistenceHost } from '../host/idempotency-core-persistence.host';

@Injectable()
export class IdempotencyCoreCompleteRepository
  extends IdempotencyCorePersistenceHost
  implements IIdempotencyCoreCompleteRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<IIdempotencyCoreCompleteRepositoryPort> = {
    provide: IDEMPOTENCY_CORE_COMPLETE_REPOSITORY_PORT,
    useClass: IdempotencyCoreCompleteRepository,
  };

  public async complete(query: IIdempotencyCoreCompleteQuery): Promise<void> {
    const { scope, key, responseBody } = query;

    await this.idempotencyKeyRepository.update(
      { scope, idempotencyKey: key },
      { status: IdempotencyStatusEnum.COMPLETED, responseBody },
    );
  }
}
