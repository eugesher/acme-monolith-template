import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { BodyFingerprintHelper } from '@acme-libs/toolkit';
import {
  IdempotencyCoreClaimOutcomeEnum,
  type IIdempotencyCoreClaimCommand,
  type IIdempotencyCoreClaimView,
} from '@acme-core/contracts/idempotency';

import { IdempotencyCoreClaimModel, type IIdempotencyCoreClaimCandidate } from '../../domain';
import {
  IDEMPOTENCY_CORE_CLAIM_REPOSITORY_PORT,
  IdempotencyCoreClaimInsertOutcomeEnum,
  type IIdempotencyCoreClaimRepositoryPort,
} from '../../outbound';

@Injectable()
export class IdempotencyCoreClaimUseCase {
  constructor(
    @Inject(IDEMPOTENCY_CORE_CLAIM_REPOSITORY_PORT)
    private readonly repository: IIdempotencyCoreClaimRepositoryPort,
    @InjectPinoLogger(IdempotencyCoreClaimUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: IIdempotencyCoreClaimCommand): Promise<IIdempotencyCoreClaimView> {
    const { scope, key, body } = command;
    const requestFingerprint = BodyFingerprintHelper.compute(body);
    const keyCandidate = IdempotencyCoreClaimModel.initCandidate({
      scope,
      key,
      requestFingerprint,
    });
    const insertOutcome = await this.insert(keyCandidate);

    if (insertOutcome) {
      return { outcome: IdempotencyCoreClaimOutcomeEnum.CLAIMED, storedResponse: undefined };
    }

    const keyRecord = await this.repository.findByKey({ scope, key });

    if (!keyRecord) {
      return this.inFlight(scope, key);
    }

    const existingKey = IdempotencyCoreClaimModel.reconstitute(keyRecord);

    if (!existingKey.matches(requestFingerprint)) {
      const keyLoggerPayload = IdempotencyCoreClaimModel.toLoggerPayload({ scope, key });

      this.logger.info(
        keyLoggerPayload,
        'Idempotency key reused with another body, the request is refused',
      );

      return { outcome: IdempotencyCoreClaimOutcomeEnum.MISMATCH, storedResponse: undefined };
    }

    if (existingKey.isCompleted()) {
      const storedResponse = existingKey.toStoredResponse();

      return { outcome: IdempotencyCoreClaimOutcomeEnum.REPLAY, storedResponse };
    }

    return this.inFlight(scope, key);
  }

  private inFlight(scope: string, key: string): IIdempotencyCoreClaimView {
    const keyLoggerPayload = IdempotencyCoreClaimModel.toLoggerPayload({ scope, key });

    this.logger.info(keyLoggerPayload, 'Idempotency key is in flight, the request is refused');

    return { outcome: IdempotencyCoreClaimOutcomeEnum.IN_FLIGHT, storedResponse: undefined };
  }

  private async insert(candidate: IIdempotencyCoreClaimCandidate): Promise<boolean> {
    const insertOutcome = await this.repository.insert(candidate);

    return insertOutcome === IdempotencyCoreClaimInsertOutcomeEnum.INSERTED;
  }
}
