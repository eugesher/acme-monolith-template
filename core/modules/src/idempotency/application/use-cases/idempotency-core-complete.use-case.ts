import { Inject, Injectable } from '@nestjs/common';

import type { IIdempotencyCoreCompleteCommand } from '@acme-core/contracts/idempotency';

import { IdempotencyCoreCompleteModel } from '../../domain';
import {
  IDEMPOTENCY_CORE_COMPLETE_REPOSITORY_PORT,
  type IIdempotencyCoreCompleteRepositoryPort,
} from '../../outbound';

@Injectable()
export class IdempotencyCoreCompleteUseCase {
  constructor(
    @Inject(IDEMPOTENCY_CORE_COMPLETE_REPOSITORY_PORT)
    private readonly repository: IIdempotencyCoreCompleteRepositoryPort,
  ) {}

  public async execute(command: IIdempotencyCoreCompleteCommand): Promise<void> {
    const { scope, key, response } = command;
    const completeUpdatePayload = IdempotencyCoreCompleteModel.toUpdatePayload({
      scope,
      key,
      response,
    });

    await this.repository.complete(completeUpdatePayload);
  }
}
