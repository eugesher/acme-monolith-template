import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { JobFailureHelper } from '@acme-libs/toolkit';

import type { ILedgerAppendReportWorkerFailedCommand } from '../types';

@Injectable()
export class LedgerAppendReportWorkerFailedCase {
  constructor(
    @InjectPinoLogger(LedgerAppendReportWorkerFailedCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public execute(command: ILedgerAppendReportWorkerFailedCommand): void {
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
