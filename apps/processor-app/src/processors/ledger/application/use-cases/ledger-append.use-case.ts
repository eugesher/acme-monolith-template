import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { CorrelationContextHelper } from '@acme-libs/observability';

import { LedgerAppendEntryModel, type ILedgerAppendEntryCandidate } from '../../domain';
import {
  LEDGER_APPEND_REPOSITORY_PORT,
  LedgerAppendEntryInsertOutcomeEnum,
  type ILedgerAppendRepositoryPort,
} from '../../outbound';
import type { ILedgerAppendCommand, ILedgerAppendOutcomeView } from '../interfaces';

@Injectable()
export class LedgerAppendUseCase {
  constructor(
    @Inject(LEDGER_APPEND_REPOSITORY_PORT)
    private readonly repository: ILedgerAppendRepositoryPort,
    @InjectPinoLogger(LedgerAppendUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: ILedgerAppendCommand): Promise<void> {
    const { operationKey, subjectType, subjectId, action, payload, occurredAt } = command;
    this.logger.info({ operationKey, action }, 'Ledger record received');

    const correlationId = CorrelationContextHelper.current(LedgerAppendUseCase.name);
    const entryCandidate = LedgerAppendEntryModel.initCandidate({
      operationKey,
      subjectType,
      subjectId,
      action,
      payload,
      correlationId,
      occurredAt,
    });
    const appendOutcome = await this.append(entryCandidate);
    const { id, appended } = appendOutcome;
    const message = appended ? 'Ledger record appended' : 'Ledger record already appended';
    const entryLoggerPayload = LedgerAppendEntryModel.toLoggerPayload(id, entryCandidate);

    this.logger.info(entryLoggerPayload, message);
  }

  private async append(candidate: ILedgerAppendEntryCandidate): Promise<ILedgerAppendOutcomeView> {
    const insertResult = await this.repository.insert(candidate);

    if (insertResult.outcome === LedgerAppendEntryInsertOutcomeEnum.INSERTED) {
      return { id: insertResult.id, appended: true };
    }

    const existingEntry = await this.repository.findByOperationKey(candidate.operationKey);

    return { id: existingEntry.id, appended: false };
  }
}
