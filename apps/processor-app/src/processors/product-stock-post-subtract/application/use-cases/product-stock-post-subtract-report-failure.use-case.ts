import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { JobFailureHelper } from '@acme-libs/toolkit';

import type { IProductStockPostSubtractReportFailureCommand } from '../types';

@Injectable()
export class ProductStockPostSubtractReportFailureUseCase {
  constructor(
    @InjectPinoLogger(ProductStockPostSubtractReportFailureUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public execute(command: IProductStockPostSubtractReportFailureCommand): void {
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
