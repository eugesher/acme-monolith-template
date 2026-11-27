import { Injectable } from '@nestjs/common';

import type {
  IIdempotencyCoreClaimCommand,
  IIdempotencyCoreClaimView,
  IIdempotencyCoreCompleteCommand,
  IIdempotencyCorePort,
  IIdempotencyCoreReleaseCommand,
} from '@acme-core/contracts/idempotency';

import {
  IdempotencyCoreClaimCase,
  IdempotencyCoreCompleteCase,
  IdempotencyCoreReleaseCase,
} from '../application';

@Injectable()
export class IdempotencyCoreFacade implements IIdempotencyCorePort {
  constructor(
    private readonly claimCase: IdempotencyCoreClaimCase,
    private readonly completeCase: IdempotencyCoreCompleteCase,
    private readonly releaseCase: IdempotencyCoreReleaseCase,
  ) {}

  public async claim(command: IIdempotencyCoreClaimCommand): Promise<IIdempotencyCoreClaimView> {
    return await this.claimCase.execute(command);
  }

  public async complete(command: IIdempotencyCoreCompleteCommand): Promise<void> {
    await this.completeCase.execute(command);
  }

  public async release(command: IIdempotencyCoreReleaseCommand): Promise<void> {
    await this.releaseCase.execute(command);
  }
}
