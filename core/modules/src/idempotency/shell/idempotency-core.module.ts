import { Module, type ClassProvider } from '@nestjs/common';

import { IDEMPOTENCY_CORE_PORT, type IIdempotencyCorePort } from '@acme-core/contracts/idempotency';

import {
  IdempotencyCoreClaimUseCase,
  IdempotencyCoreCompleteUseCase,
  IdempotencyCoreReleaseUseCase,
} from '../application';
import {
  IdempotencyCoreClaimRepository,
  IdempotencyCoreCompleteRepository,
  IdempotencyCoreReleaseRepository,
} from '../infrastructure';
import { IdempotencyCoreFacade } from './idempotency-core.facade';

@Module({
  exports: [IDEMPOTENCY_CORE_PORT],
  providers: [
    {
      provide: IDEMPOTENCY_CORE_PORT,
      useClass: IdempotencyCoreFacade,
    } satisfies ClassProvider<IIdempotencyCorePort>,
    IdempotencyCoreClaimUseCase,
    IdempotencyCoreCompleteUseCase,
    IdempotencyCoreReleaseUseCase,
    IdempotencyCoreClaimRepository.provider,
    IdempotencyCoreCompleteRepository.provider,
    IdempotencyCoreReleaseRepository.provider,
  ],
})
export class IdempotencyCoreModule {}
