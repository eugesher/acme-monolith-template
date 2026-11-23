import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job, JobsOptions } from 'bullmq';

import { CorrelationContextHelper } from '@acme-libs/observability';
import {
  LEDGER_RECORD_QUEUE,
  type ILedgerRecordProcessorPayload,
} from '@acme-core/contracts/ledger';

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
  public async handleFailed(job: Job<ILedgerRecordProcessorPayload>, error: Error): Promise<void> {
    const { data, attemptsMade, opts } = job;
    const { operationKey, correlationId } = data;
    const { attempts } = opts as Required<Pick<JobsOptions, 'attempts'>>;

    await CorrelationContextHelper.run(correlationId, () => {
      this.reportFailure.execute({ operationKey, attempt: attemptsMade, attempts, error });

      return Promise.resolve();
    });
  }
}
