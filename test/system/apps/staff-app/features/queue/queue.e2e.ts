import { HttpStatus } from '@nestjs/common';
import request from 'supertest';

import type { AppE2EContext } from '../../context/app-e2e.context';

export class QueueE2E {
  private constructor(private readonly ctx: AppE2EContext) {}

  public static of(ctx: AppE2EContext): QueueE2E {
    return new QueueE2E(ctx);
  }

  public handleRetryFailedJob(): void {
    describe('POST /api/queues/:queueName/jobs/failed/:jobId/retry', () => {
      it('should return a failed record to the queue and append it once its cause is gone', async () => {
        const job = await this.ctx.ledgerAppendQueue.add(
          'ledger-append',
          {
            operationKey: 'e2e-system-queue:1',
            subjectType: 'p'.repeat(65),
            subjectId: '201',
            action: 'ProductArchived',
            payload: { sku: 'SKU-0004', previousStatus: 'active' },
            occurredAt: '2026-01-06T09:00:00.000Z',
            correlationId: 'e2e00000-0000-4000-8000-000000000025',
          },
          { attempts: 1 },
        );

        await this.ctx.pollUntil(
          () => job.isFailed(),
          (failed) => failed,
        );
        await job.updateData({ ...job.data, subjectType: 'product' });

        await request(this.ctx.app.getHttpServer())
          .post(`/api/queues/ledger-append/jobs/failed/${job.id}/retry`)
          .auth(this.ctx.adminToken, { type: 'bearer' })
          .expect(HttpStatus.NO_CONTENT);

        const ledgerEntries = await this.ctx.pollUntil<Record<string, unknown>[]>(
          () =>
            this.ctx.dataSource.query('SELECT * FROM ledger_entry WHERE operation_key = ?', [
              'e2e-system-queue:1',
            ]),
          (rows) => rows.length >= 1,
        );

        expect({
          db: { ledger_entry: ledgerEntries },
          failed: await this.ctx.ledgerAppendQueue.getFailedCount(),
        }).toMatchSnapshot({
          db: { ledger_entry: [{ id: expect.any(String), recorded_at: expect.any(Date) }] },
        });
      });
    });
  }
}
