import { getQueueToken } from '@nestjs/bull';
import type { Job, Queue } from 'bull';
import type { Redis } from 'ioredis';

import { AppNameEnum, AuthAudienceEnum } from '@acme-libs/kernel';
import { CACHE_LIB_REDIS_CLIENT_TOKEN } from '@acme-libs/testing';
import { AuthE2EContext } from '@acme-libs/testing';
import {
  LEDGER_RECORD_QUEUE,
  type ILedgerRecordProcessorPayload,
} from '@acme-core/contracts/ledger';
import { AppModule } from '@acme-staff/app/app.module';
import type { Maybe } from '@acme-libs/toolkit';

interface IAppE2EState {
  redis: Redis;
  ledgerRecordQueue: Queue<ILedgerRecordProcessorPayload>;
  adminToken: string;
  editorToken: string;
  viewerToken: string;
}

export class AppE2EContext extends AuthE2EContext {
  public get redis(): Redis {
    return this.started.redis;
  }

  public get ledgerRecordQueue(): Queue<ILedgerRecordProcessorPayload> {
    return this.started.ledgerRecordQueue;
  }

  public get adminToken(): string {
    return this.started.adminToken;
  }

  public get editorToken(): string {
    return this.started.editorToken;
  }

  public get viewerToken(): string {
    return this.started.viewerToken;
  }

  private state: Maybe<IAppE2EState>;

  private get started(): IAppE2EState {
    if (!this.state) {
      throw new Error('AppE2EContext is read before init(): use it inside it() and hooks');
    }

    return this.state;
  }

  constructor() {
    super(AppModule, AppNameEnum.STAFF_APP, AuthAudienceEnum.STAFF);
  }

  public override async init(): Promise<void> {
    await super.init();

    const redis = this.moduleFixture.get<Redis>(CACHE_LIB_REDIS_CLIENT_TOKEN);
    const ledgerRecordQueue = this.moduleFixture.get<Queue<ILedgerRecordProcessorPayload>>(
      getQueueToken(LEDGER_RECORD_QUEUE),
    );
    const adminToken = this.jwt.sign({ sub: '1' });
    const editorToken = this.jwt.sign({ sub: '2' });
    const viewerToken = this.jwt.sign({ sub: '3' });

    this.state = { redis, ledgerRecordQueue, adminToken, editorToken, viewerToken };
  }

  public async takeLedgerRecords(): Promise<ILedgerRecordProcessorPayload[]> {
    const jobs = await this.ledgerRecordQueue.getWaiting();

    await this.ledgerRecordQueue.empty();

    return jobs.map((job) => job.data);
  }

  public async failLedgerRecord(
    record: ILedgerRecordProcessorPayload,
  ): Promise<Job<ILedgerRecordProcessorPayload>> {
    const added = await this.ledgerRecordQueue.add(record, { attempts: 1 });
    const job = await this.ledgerRecordQueue.getNextJob();

    if (job?.id !== added.id) {
      throw new Error(`Job ${added.id} of queue ${LEDGER_RECORD_QUEUE} is not the next to fail`);
    }

    await job.moveToFailed(new Error('The e2e case failed the record'));

    return job;
  }
}
