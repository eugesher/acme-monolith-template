import { HttpStatus } from '@nestjs/common';
import request from 'supertest';

import type { AppE2EContext } from '../../context/app-e2e.context';

export class QueueE2E {
  private constructor(private readonly ctx: AppE2EContext) {}

  public static of(ctx: AppE2EContext): QueueE2E {
    return new QueueE2E(ctx);
  }

  public getMany(): void {
    describe('GET /api/queues', () => {
      it('should list the queues with their job counts', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .get('/api/queues')
          .auth(this.ctx.viewerToken, { type: 'bearer' })
          .expect(HttpStatus.OK);

        expect({ response: { body: response.body } }).toMatchSnapshot();
      });
    });
  }

  public getFailedJobs(): void {
    describe('GET /api/queues/:queueName/jobs/failed', () => {
      it('should answer a page of the failed jobs with the reason and the instants of the failure', async () => {
        const job = await this.ctx.failLedgerRecord({
          operationKey: 'e2e-queue:1',
          subjectType: 'product',
          subjectId: '200',
          action: 'ProductCreated',
          payload: {},
          occurredAt: '2026-01-06T08:00:00.000Z',
          correlationId: 'e2e00000-0000-4000-8000-000000000009',
        });

        try {
          const response = await request(this.ctx.app.getHttpServer())
            .get('/api/queues/ledger-append/jobs/failed')
            .query({ page: 1, limit: 10 })
            .auth(this.ctx.viewerToken, { type: 'bearer' })
            .expect(HttpStatus.OK);

          expect({ response: { body: response.body } }).toMatchSnapshot({
            response: {
              body: {
                data: [
                  {
                    id: expect.stringMatching(/^\d+$/),
                    createdAt: expect.stringMatching(
                      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
                    ),
                    processedAt: expect.stringMatching(
                      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
                    ),
                    failedAt: expect.stringMatching(
                      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
                    ),
                    stacktrace: [expect.any(String)],
                  },
                ],
              },
            },
          });
        } finally {
          await job.remove();
        }
      });

      it('should refuse an unknown queue with 404 QUEUE_NOT_FOUND', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .get('/api/queues/unknown/jobs/failed')
          .auth(this.ctx.viewerToken, { type: 'bearer' })
          .expect(HttpStatus.NOT_FOUND);

        expect({ response: { body: response.body } }).toMatchSnapshot();
      });
    });
  }

  public retryFailedJob(): void {
    describe('POST /api/queues/:queueName/jobs/failed/:jobId/retry', () => {
      it('should return a failed record to the queue', async () => {
        const job = await this.ctx.failLedgerRecord({
          operationKey: 'e2e-queue:2',
          subjectType: 'product',
          subjectId: '201',
          action: 'ProductArchived',
          payload: { sku: 'SKU-0004', previousStatus: 'active' },
          occurredAt: '2026-01-06T09:00:00.000Z',
          correlationId: 'e2e00000-0000-4000-8000-000000000010',
        });

        await request(this.ctx.app.getHttpServer())
          .post(`/api/queues/ledger-append/jobs/failed/${job.id}/retry`)
          .auth(this.ctx.adminToken, { type: 'bearer' })
          .expect(HttpStatus.NO_CONTENT);

        expect({
          state: await job.getState(),
          failed: await this.ctx.ledgerAppendQueue.getFailedCount(),
          records: await this.ctx.takeLedgerRecords(),
        }).toMatchSnapshot();
      });

      it('should refuse a job that is not failed with 409 QUEUE_JOB_NOT_FAILED', async () => {
        const job = await this.ctx.ledgerAppendQueue.add(
          'ledger-append',
          {
            operationKey: 'e2e-queue:3',
            subjectType: 'product',
            subjectId: '202',
            action: 'ProductCreated',
            payload: {},
            occurredAt: '2026-01-06T10:00:00.000Z',
            correlationId: 'e2e00000-0000-4000-8000-000000000011',
          },
          { delay: 60000 },
        );

        try {
          const response = await request(this.ctx.app.getHttpServer())
            .post(`/api/queues/ledger-append/jobs/failed/${job.id}/retry`)
            .auth(this.ctx.adminToken, { type: 'bearer' })
            .expect(HttpStatus.CONFLICT);

          expect({ response: { body: response.body } }).toMatchSnapshot({
            response: {
              body: {
                message: expect.stringMatching(
                  /^Job \S+ of queue ledger-append is delayed, not failed$/,
                ),
              },
            },
          });
        } finally {
          await job.remove();
        }
      });

      it('should refuse an unknown job with 404 QUEUE_JOB_NOT_FOUND', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .post('/api/queues/ledger-append/jobs/failed/999999/retry')
          .auth(this.ctx.adminToken, { type: 'bearer' })
          .expect(HttpStatus.NOT_FOUND);

        expect({ response: { body: response.body } }).toMatchSnapshot();
      });

      it('should refuse an unknown queue with 404 QUEUE_NOT_FOUND', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .post('/api/queues/unknown/jobs/failed/1/retry')
          .auth(this.ctx.adminToken, { type: 'bearer' })
          .expect(HttpStatus.NOT_FOUND);

        expect({ response: { body: response.body } }).toMatchSnapshot();
      });
    });
  }

  public deleteFailedJob(): void {
    describe('DELETE /api/queues/:queueName/jobs/failed/:jobId', () => {
      it('should delete a failed job', async () => {
        const job = await this.ctx.failLedgerRecord({
          operationKey: 'e2e-queue:4',
          subjectType: 'product',
          subjectId: '203',
          action: 'ProductCreated',
          payload: {},
          occurredAt: '2026-01-06T11:00:00.000Z',
          correlationId: 'e2e00000-0000-4000-8000-000000000012',
        });

        await request(this.ctx.app.getHttpServer())
          .delete(`/api/queues/ledger-append/jobs/failed/${job.id}`)
          .auth(this.ctx.adminToken, { type: 'bearer' })
          .expect(HttpStatus.NO_CONTENT);

        expect({
          state: await job.getState(),
          failed: await this.ctx.ledgerAppendQueue.getFailedCount(),
        }).toMatchSnapshot();
      });

      it('should refuse an unknown job with 404 QUEUE_JOB_NOT_FOUND', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .delete('/api/queues/ledger-append/jobs/failed/999999')
          .auth(this.ctx.adminToken, { type: 'bearer' })
          .expect(HttpStatus.NOT_FOUND);

        expect({ response: { body: response.body } }).toMatchSnapshot();
      });
    });
  }
}
