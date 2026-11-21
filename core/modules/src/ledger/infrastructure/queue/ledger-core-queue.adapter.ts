import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { DeadlineHelper } from '@acme-libs/toolkit';
import {
  LEDGER_RECORD_QUEUE,
  type ILedgerRecordProcessorPayload,
} from '@acme-core/contracts/ledger';

import type { ILedgerCoreQueueAddCommand, ILedgerCoreQueuePort } from '../../outbound';

@Injectable()
export class LedgerCoreQueueAdapter implements ILedgerCoreQueuePort {
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
          LEDGER_RECORD_QUEUE,
          { operationKey, subjectType, subjectId, action, payload, occurredAt, correlationId },
          { deduplication: { id: operationKey } },
        ),
      { timeoutMs, message: `Enqueue timed out after ${timeoutMs} ms` },
    );
  }
}
