import { Injectable, type ClassProvider } from '@nestjs/common';
import { LessThan } from 'typeorm';

import { IdempotencyStatusEnum } from '@acme-libs/kernel';

import {
  IDEMPOTENCY_PURGE_PROCESS_REPOSITORY_PORT,
  type IIdempotencyPurgeProcessRepositoryPort,
} from '../../../outbound';
import { IdempotencyPurgePersistenceHost } from '../host/idempotency-purge-persistence.host';

@Injectable()
export class IdempotencyPurgeProcessRepository
  extends IdempotencyPurgePersistenceHost
  implements IIdempotencyPurgeProcessRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<IIdempotencyPurgeProcessRepositoryPort> = {
    provide: IDEMPOTENCY_PURGE_PROCESS_REPOSITORY_PORT,
    useClass: IdempotencyPurgeProcessRepository,
  };

  public async deleteCreatedBefore(cutoff: Date): Promise<number> {
    const deleteResult = await this.idempotencyKeyRepository.delete({
      createdAt: LessThan(cutoff),
    });

    return deleteResult.affected ?? 0;
  }

  public async deleteInFlightCreatedBefore(cutoff: Date): Promise<number> {
    const deleteResult = await this.idempotencyKeyRepository.delete({
      status: IdempotencyStatusEnum.IN_FLIGHT,
      createdAt: LessThan(cutoff),
    });

    return deleteResult.affected ?? 0;
  }
}
