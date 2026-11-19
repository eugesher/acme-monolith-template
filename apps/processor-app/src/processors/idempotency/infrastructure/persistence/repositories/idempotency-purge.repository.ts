import { Injectable, type ClassProvider } from '@nestjs/common';
import { LessThan } from 'typeorm';

import { IdempotencyStatusEnum } from '@acme-libs/kernel';

import {
  IDEMPOTENCY_PURGE_REPOSITORY_PORT,
  type IIdempotencyPurgeRepositoryPort,
} from '../../../outbound';
import { IdempotencyPersistenceHost } from '../host/idempotency-persistence.host';

@Injectable()
export class IdempotencyPurgeRepository
  extends IdempotencyPersistenceHost
  implements IIdempotencyPurgeRepositoryPort
{
  public static readonly provider: ClassProvider<IIdempotencyPurgeRepositoryPort> = {
    provide: IDEMPOTENCY_PURGE_REPOSITORY_PORT,
    useClass: IdempotencyPurgeRepository,
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
