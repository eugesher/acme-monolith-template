import { InjectQueue } from '@nestjs/bull';
import { Injectable, type ClassProvider } from '@nestjs/common';
import type { Queue } from 'bull';

import { DeadlineHelper } from '@acme-libs/toolkit';
import {
  LEDGER_RECORD_QUEUE,
  type ILedgerRecordProcessorPayload,
} from '@acme-core/contracts/ledger';

import {
  LEDGER_CORE_QUEUE_PORT,
  type ILedgerCoreQueueAddCommand,
  type ILedgerCoreQueuePort,
} from '../../outbound';

@Injectable()
export class LedgerCoreQueueAdapter implements ILedgerCoreQueuePort {
  public static readonly provider: ClassProvider<ILedgerCoreQueuePort> = {
    provide: LEDGER_CORE_QUEUE_PORT,
    useClass: LedgerCoreQueueAdapter,
  };

  constructor(
    @InjectQueue(LEDGER_RECORD_QUEUE)
    private readonly queue: Queue<ILedgerRecordProcessorPayload>,
  ) {}

  public async add(command: ILedgerCoreQueueAddCommand): Promise<void> {
    const { record, timeoutMs } = command;
    const { operationKey, subjectType, subjectId, action, payload, occurredAt, correlationId } =
      record;

    await DeadlineHelper.race(
      () =>
        this.queue.add(
          { operationKey, subjectType, subjectId, action, payload, occurredAt, correlationId },
          { jobId: operationKey },
        ),
      { timeoutMs, message: `Enqueue timed out after ${timeoutMs} ms` },
    );
  }
}
