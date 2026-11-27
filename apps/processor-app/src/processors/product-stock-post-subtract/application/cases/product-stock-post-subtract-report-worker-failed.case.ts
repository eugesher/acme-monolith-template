import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { JobFailureHelper } from '@acme-libs/toolkit';

import type { IProductStockPostSubtractReportWorkerFailedCommand } from '../types';

@Injectable()
export class ProductStockPostSubtractReportWorkerFailedCase {
  constructor(
    @InjectPinoLogger(ProductStockPostSubtractReportWorkerFailedCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public execute(command: IProductStockPostSubtractReportWorkerFailedCommand): void {
    const { productIds, attempt, attempts, error } = command;

    JobFailureHelper.report({
      logger: this.logger,
      label: 'Post-subtract check',
      context: { productIds },
      attempt,
      attempts,
      error,
    });
  }
}
