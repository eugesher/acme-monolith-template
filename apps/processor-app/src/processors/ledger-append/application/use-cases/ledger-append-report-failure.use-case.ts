import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { JobFailureHelper } from '@acme-libs/toolkit';

import type { ILedgerAppendReportFailureCommand } from '../types';

@Injectable()
export class LedgerAppendReportFailureUseCase {
  constructor(
    @InjectPinoLogger(LedgerAppendReportFailureUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public execute(command: ILedgerAppendReportFailureCommand): void {
    const { operationKey, attempt, attempts, error } = command;

    JobFailureHelper.report({
      logger: this.logger,
      label: 'Ledger record',
      context: { operationKey },
      attempt,
      attempts,
      error,
    });
  }
}
