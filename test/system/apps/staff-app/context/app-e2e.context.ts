import { getQueueToken } from '@nestjs/bullmq';
import type { INestApplication } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { AppNameEnum, AuthAudienceEnum } from '@acme-libs/kernel';
import { AuthE2EContext } from '@acme-libs/testing';
import { LedgerAppendQueue } from '@acme-core/queues';
import { AppModule as ProcessorAppModule } from '@acme-processor/app';
import { AppModule } from '@acme-staff/app';
import type { Maybe } from '@acme-libs/toolkit';
import type { ILedgerAppendProcessorPayload } from '@acme-core/contracts/ledger';

interface IAppE2EState {
  processor: INestApplication;
  ledgerAppendQueue: Queue<ILedgerAppendProcessorPayload>;
  adminToken: string;
  editorToken: string;
}

export class AppE2EContext extends AuthE2EContext {
  public get ledgerAppendQueue(): Queue<ILedgerAppendProcessorPayload> {
    return this.appE2EState.ledgerAppendQueue;
  }

  public get adminToken(): string {
    return this.appE2EState.adminToken;
  }

  public get editorToken(): string {
    return this.appE2EState.editorToken;
  }

  private static readonly POLL_INTERVAL_MS = 500;
  private static readonly POLL_ATTEMPTS = 30;

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
    const processorFixture = await AppE2EContext.compile(ProcessorAppModule);
    const processor = processorFixture.createNestApplication();

    await processor.init();
    await super.init();

    const ledgerAppendQueue = this.moduleFixture.get<Queue<ILedgerAppendProcessorPayload>>(
      getQueueToken(LedgerAppendQueue.NAME),
    );
    const adminToken = this.jwtService.sign({ sub: '1' });
    const editorToken = this.jwtService.sign({ sub: '2' });

    this._appE2EState = { processor, ledgerAppendQueue, adminToken, editorToken };
  }

  public override async close(): Promise<void> {
    await this.appE2EState.processor.close();
    await super.close();
  }

  public async pollUntil<T>(read: () => Promise<T>, isDone: (value: T) => boolean): Promise<T> {
    await AppE2EContext.delay();

    let value = await read();

    for (let attempt = 1; attempt < AppE2EContext.POLL_ATTEMPTS && !isDone(value); attempt++) {
      await AppE2EContext.delay();
      value = await read();
    }

    return value;
  }

  private static async delay(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, AppE2EContext.POLL_INTERVAL_MS));
  }
}
