import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { CorrelationContextHelper } from '@acme-libs/observability';

import { LedgerAppendEntryModel, type ILedgerAppendEntryCandidate } from '../../domain';
import {
  LEDGER_APPEND_PROCESS_REPOSITORY_PORT,
  LedgerAppendProcessEntryInsertOutcomeEnum,
  type ILedgerAppendProcessRepositoryPort,
} from '../../outbound';
import type { ILedgerAppendOutcomeView, ILedgerAppendProcessCommand } from '../types';

@Injectable()
export class LedgerAppendProcessCase {
  constructor(
    @Inject(LEDGER_APPEND_PROCESS_REPOSITORY_PORT)
    private readonly repository: ILedgerAppendProcessRepositoryPort,
    @InjectPinoLogger(LedgerAppendProcessCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: ILedgerAppendProcessCommand): Promise<void> {
    const { operationKey, subjectType, subjectId, action, payload, occurredAt } = command;
    this.logger.info({ operationKey, action }, 'Ledger record received');

    const correlationId = CorrelationContextHelper.current(LedgerAppendProcessCase.name);
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

    if (insertResult.outcome === LedgerAppendProcessEntryInsertOutcomeEnum.INSERTED) {
      return { id: insertResult.id, appended: true };
    }

    const existingEntry = await this.repository.findByOperationKey(candidate.operationKey);

    return { id: existingEntry.id, appended: false };
  }
}
