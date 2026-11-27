import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job, JobsOptions } from 'bullmq';

import { CorrelationContextHelper } from '@acme-libs/observability';
import { ProductStockPostSubtractQueue } from '@acme-core/queues';
import type { IProductStockPostSubtractPayload } from '@acme-core/contracts/product-stock';

import {
  ProductStockPostSubtractProcessCase,
  ProductStockPostSubtractReportWorkerFailedCase,
} from '../application';

@Processor(ProductStockPostSubtractQueue.NAME)
export class ProductStockPostSubtractProcessor extends WorkerHost {
  constructor(
    private readonly processCase: ProductStockPostSubtractProcessCase,
    private readonly reportWorkerFailedCase: ProductStockPostSubtractReportWorkerFailedCase,
  ) {
    super();
  }

  public async process(job: Job<IProductStockPostSubtractPayload>): Promise<void> {
    const { data } = job;
    const { productIds, correlationId } = data;

    await CorrelationContextHelper.run(correlationId, () =>
      this.processCase.execute({ productIds }),
    );
  }

  @OnWorkerEvent('failed')
  public async onWorkerFailed(
    job: Job<IProductStockPostSubtractPayload>,
    error: Error,
  ): Promise<void> {
    const { data, attemptsMade, opts } = job;
    const { productIds, correlationId } = data;
    const { attempts } = opts as Required<Pick<JobsOptions, 'attempts'>>;

    await CorrelationContextHelper.run(correlationId, () => {
      this.reportWorkerFailedCase.execute({ productIds, attempt: attemptsMade, attempts, error });

      return Promise.resolve();
    });
  }
}
