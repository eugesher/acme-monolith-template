import { HttpStatus } from '@nestjs/common';
import request from 'supertest';

import { LedgerActionEnum, LedgerSubjectTypeEnum } from '@acme-libs/kernel';
import { CorrelationContextHelper } from '@acme-libs/observability';
import { LEDGER_CORE_PORT, type ILedgerCorePort } from '@acme-core/contracts/ledger';

import type { AppE2EContext } from '../../context/app-e2e.context';

export class LedgerE2E {
  private constructor(private readonly ctx: AppE2EContext) {}

  public static of(ctx: AppE2EContext): LedgerE2E {
    return new LedgerE2E(ctx);
  }

  public getMany(): void {
    describe('GET /api/ledger', () => {
      it('should list the entries of one subject', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .get('/api/ledger')
          .query({ subjectType: 'product', subjectId: '100' })
          .auth(this.ctx.viewerToken, { type: 'bearer' })
          .expect(HttpStatus.OK);

        expect({ response: { body: response.body } }).toMatchSnapshot();
      });

      it('should refuse a malformed page with 400 from validation', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .get('/api/ledger')
          .query({ page: 'first' })
          .auth(this.ctx.viewerToken, { type: 'bearer' })
          .expect(HttpStatus.BAD_REQUEST);

        expect({ response: { body: response.body } }).toMatchSnapshot();
      });

      it('should list the entries of one correlation id', async () => {
        await this.ctx.dataSource.query(
          "INSERT INTO ledger_entry (id, operation_key, subject_type, subject_id, action, payload, correlation_id, occurred_at, recorded_at) VALUES (490, 'e2e-ledger:1', 'product', '101', 'ProductCreated', '{}', 'e2e00000-0000-4000-8000-000000000026', '2026-01-07 08:00:00.000', '2026-01-07 08:00:00.000')",
        );

        try {
          const response = await request(this.ctx.app.getHttpServer())
            .get('/api/ledger')
            .query({ correlationId: 'e2e00000-0000-4000-8000-000000000026' })
            .auth(this.ctx.viewerToken, { type: 'bearer' })
            .expect(HttpStatus.OK);

          expect({ response: { body: response.body } }).toMatchSnapshot();
        } finally {
          await this.ctx.dataSource.query('DELETE FROM ledger_entry WHERE id = 490');
        }
      });
    });
  }

  public appendEnqueue(): void {
    describe('LEDGER_CORE_PORT appendEnqueue', () => {
      it('should keep one job for a record enqueued twice under the same operation key', async () => {
        const ledger = this.ctx.moduleFixture.get<ILedgerCorePort>(LEDGER_CORE_PORT);
        const record = {
          operationKey: 'e2e-enqueue:1',
          subjectType: LedgerSubjectTypeEnum.PRODUCT,
          subjectId: '100',
          action: LedgerActionEnum.PRODUCT_CREATED,
          payload: { name: 'Twice' },
          occurredAt: '2026-01-05T08:00:00.000Z',
        };

        await CorrelationContextHelper.run('e2e00000-0000-4000-8000-000000000019', async () => {
          await ledger.appendEnqueue(record);
          await ledger.appendEnqueue(record);
        });

        const records = await this.ctx.takeLedgerRecords();

        expect(records).toEqual([
          { ...record, correlationId: 'e2e00000-0000-4000-8000-000000000019' },
        ]);
      });
    });
  }
}
