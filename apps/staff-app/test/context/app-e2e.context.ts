import { getQueueToken } from '@nestjs/bullmq';
import { Worker, type Job, type Queue } from 'bullmq';
import type { Redis } from 'ioredis';

import { AppNameEnum, AuthAudienceEnum } from '@acme-libs/kernel';
import { CACHE_REDIS_CLIENT_TOKEN } from '@acme-libs/testing';
import { AuthE2EContext } from '@acme-libs/testing';
import { LedgerAppendQueue } from '@acme-core/queues';
import { AppModule } from '@acme-staff/app';
import type { Maybe } from '@acme-libs/toolkit';
import type { ILedgerAppendProcessorPayload } from '@acme-core/contracts/ledger';

interface IAppE2EState {
  redis: Redis;
  ledgerAppendQueue: Queue<ILedgerAppendProcessorPayload>;
  failingWorker: Worker<ILedgerAppendProcessorPayload>;
  adminToken: string;
  editorToken: string;
  viewerToken: string;
}

export class AppE2EContext extends AuthE2EContext {
  public get redis(): Redis {
    return this.appE2EState.redis;
  }

  public get ledgerAppendQueue(): Queue<ILedgerAppendProcessorPayload> {
    return this.appE2EState.ledgerAppendQueue;
  }

  public get adminToken(): string {
    return this.appE2EState.adminToken;
  }

  public get editorToken(): string {
    return this.appE2EState.editorToken;
  }

  public get viewerToken(): string {
    return this.appE2EState.viewerToken;
  }

  private _appE2EState: Maybe<IAppE2EState>;

  private get appE2EState(): IAppE2EState {
    if (!this._appE2EState) {
      throw new Error('AppE2EContext is read before init(): use it inside it() and hooks');
    }

    return this._appE2EState;
  }

  constructor() {
    super(AppModule, AppNameEnum.STAFF_APP, AuthAudienceEnum.STAFF);
  }

  public override async init(): Promise<void> {
    await super.init();

    const redis = this.moduleFixture.get<Redis>(CACHE_REDIS_CLIENT_TOKEN);
    const ledgerAppendQueue = this.moduleFixture.get<Queue<ILedgerAppendProcessorPayload>>(
      getQueueToken(LedgerAppendQueue.NAME),
    );
    const { connection, prefix } = ledgerAppendQueue.opts;
    const failingWorker = new Worker<ILedgerAppendProcessorPayload>(LedgerAppendQueue.NAME, null, {
      connection,
      prefix,
    });
    const adminToken = this.jwtService.sign({ sub: '1' });
    const editorToken = this.jwtService.sign({ sub: '2' });
    const viewerToken = this.jwtService.sign({ sub: '3' });

    this._appE2EState = {
      redis,
      ledgerAppendQueue,
      failingWorker,
      adminToken,
      editorToken,
      viewerToken,
    };
  }

  public override async close(): Promise<void> {
    await this.appE2EState.failingWorker.close();
    await super.close();
  }

  public async takeLedgerRecords(): Promise<ILedgerAppendProcessorPayload[]> {
    const jobs = await this.ledgerAppendQueue.getWaiting();

    await this.ledgerAppendQueue.drain();

    return jobs.map((job) => job.data);
  }

  public async failLedgerRecord(
    record: ILedgerAppendProcessorPayload,
  ): Promise<Job<ILedgerAppendProcessorPayload>> {
    const added = await this.ledgerAppendQueue.add(LedgerAppendQueue.NAME, record, { attempts: 1 });
    const token = 'e2e-failing-worker';
    const job = await this.appE2EState.failingWorker.getNextJob(token);

    if (job.id !== added.id) {
      throw new Error(`Job ${added.id} of queue ${LedgerAppendQueue.NAME} is not the next to fail`);
    }

    await job.moveToFailed(new Error('The e2e case failed the record'), token);

    return job;
  }
}
