import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, type ClassProvider } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { DeadlineHelper } from '@acme-libs/toolkit';
import { LedgerQueue } from '@acme-core/queues';
import type { ILedgerRecordProcessorPayload } from '@acme-core/contracts/ledger';

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
    @InjectQueue(LedgerQueue.NAME)
    private readonly queue: Queue<ILedgerRecordProcessorPayload>,
  ) {}

  public async add(command: ILedgerCoreQueueAddCommand): Promise<void> {
    const { record, timeoutMs } = command;
    const { operationKey, subjectType, subjectId, action, payload, occurredAt, correlationId } =
      record;

    await DeadlineHelper.race(
      () =>
        this.queue.add(
          LedgerQueue.NAME,
          { operationKey, subjectType, subjectId, action, payload, occurredAt, correlationId },
          { deduplication: { id: operationKey } },
        ),
      { timeoutMs, message: `Enqueue timed out after ${timeoutMs} ms` },
    );
  }
}
