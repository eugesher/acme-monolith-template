import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';

import { CorrelationContextHelper } from '@acme-libs/observability';
import {
  LEDGER_RECORD_QUEUE,
  type ILedgerRecordProcessorPayload,
} from '@acme-core/contracts/ledger';
import type { Maybe } from '@acme-libs/toolkit';

import { LedgerAppendReportFailureUseCase, LedgerAppendUseCase } from '../application';

@Processor(LEDGER_RECORD_QUEUE)
export class LedgerAppendProcessor extends WorkerHost {
  constructor(
    private readonly append: LedgerAppendUseCase,
    private readonly reportFailure: LedgerAppendReportFailureUseCase,
  ) {
    super();
  }

  public async process(job: Job<ILedgerRecordProcessorPayload>): Promise<void> {
    const { data } = job;
    const { operationKey, subjectType, subjectId, action, payload, occurredAt, correlationId } =
      data;

    await CorrelationContextHelper.run(correlationId, () =>
      this.append.execute({ operationKey, subjectType, subjectId, action, payload, occurredAt }),
    );
  }

  @OnWorkerEvent('failed')
  public async handleFailed(
    job: Maybe<Job<ILedgerRecordProcessorPayload>>,
    error: Error,
  ): Promise<void> {
    if (!job) {
      return;
    }

    const { data, attemptsMade, opts } = job;
    const { operationKey, correlationId } = data;
    const attempts = opts.attempts ?? 1;

    await CorrelationContextHelper.run(correlationId, () => {
      this.reportFailure.execute({ operationKey, attempt: attemptsMade, attempts, error });

      return Promise.resolve();
    });
  }
}
