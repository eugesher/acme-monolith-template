import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job, JobsOptions } from 'bullmq';

import { CorrelationContextHelper } from '@acme-libs/observability';
import { ProductStockPostSubtractQueue } from '@acme-core/queues';
import type { IProductStockPostSubtractPayload } from '@acme-core/contracts/product-stock';

import {
  ProductStockPostSubtractReportFailureUseCase,
  ProductStockPostSubtractUseCase,
} from '../application';

@Processor(ProductStockPostSubtractQueue.NAME)
export class ProductStockPostSubtractProcessor extends WorkerHost {
  constructor(
    private readonly postSubtract: ProductStockPostSubtractUseCase,
    private readonly reportFailure: ProductStockPostSubtractReportFailureUseCase,
  ) {
    super();
  }

  public async process(job: Job<IProductStockPostSubtractPayload>): Promise<void> {
    const { data } = job;
    const { productIds, correlationId } = data;

    await CorrelationContextHelper.run(correlationId, () =>
      this.postSubtract.execute({ productIds }),
    );
  }

  @OnWorkerEvent('failed')
  public async handleFailed(
    job: Job<IProductStockPostSubtractPayload>,
    error: Error,
  ): Promise<void> {
    const { data, attemptsMade, opts } = job;
    const { productIds, correlationId } = data;
    const { attempts } = opts as Required<Pick<JobsOptions, 'attempts'>>;

    await CorrelationContextHelper.run(correlationId, () => {
      this.reportFailure.execute({ productIds, attempt: attemptsMade, attempts, error });

      return Promise.resolve();
    });
  }
}
