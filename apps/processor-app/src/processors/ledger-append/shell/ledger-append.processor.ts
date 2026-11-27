import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job, JobsOptions } from 'bullmq';

import { CorrelationContextHelper } from '@acme-libs/observability';
import { LedgerAppendQueue } from '@acme-core/queues';
import type { ILedgerAppendProcessorPayload } from '@acme-core/contracts/ledger';

import { LedgerAppendProcessCase, LedgerAppendReportWorkerFailedCase } from '../application';

@Processor(LedgerAppendQueue.NAME)
export class LedgerAppendProcessor extends WorkerHost {
  constructor(
    private readonly processCase: LedgerAppendProcessCase,
    private readonly reportWorkerFailedCase: LedgerAppendReportWorkerFailedCase,
  ) {
    super();
  }

  public async process(job: Job<ILedgerAppendProcessorPayload>): Promise<void> {
    const { data } = job;
    const { operationKey, subjectType, subjectId, action, payload, occurredAt, correlationId } =
      data;

    await CorrelationContextHelper.run(correlationId, () =>
      this.processCase.execute({
        operationKey,
        subjectType,
        subjectId,
        action,
        payload,
        occurredAt,
      }),
    );
  }

  @OnWorkerEvent('failed')
  public async onWorkerFailed(
    job: Job<ILedgerAppendProcessorPayload>,
    error: Error,
  ): Promise<void> {
    const { data, attemptsMade, opts } = job;
    const { operationKey, correlationId } = data;
    const { attempts } = opts as Required<Pick<JobsOptions, 'attempts'>>;

    await CorrelationContextHelper.run(correlationId, () => {
      this.reportWorkerFailedCase.execute({ operationKey, attempt: attemptsMade, attempts, error });

      return Promise.resolve();
    });
  }
}
