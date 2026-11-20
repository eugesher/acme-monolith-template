import { HttpStatus } from '@nestjs/common';
import request from 'supertest';

import type { AppE2EContext } from '../../context/app-e2e.context';

export class OrderE2E {
  private constructor(private readonly ctx: AppE2EContext) {}

  public static of(ctx: AppE2EContext): OrderE2E {
    return new OrderE2E(ctx);
  }

  public handlePlace(): void {
    describe('POST /api/orders', () => {
      it('should place the order, append its ledger entry and archive the sold-out product with its own entry under the correlation id', async () => {
        await this.ctx.redis.set('acme:catalog:v1:page:1:limit:20', '{}');

        const response = await request(this.ctx.app.getHttpServer())
          .post('/api/orders')
          .set('Idempotency-Key', 'system-order-key')
          .set('x-correlation-id', 'e2e00000-0000-4000-8000-000000000024')
          .auth(this.ctx.annToken, { type: 'bearer' })
          .send({ productIds: ['103', '103', '103'] })
          .expect(HttpStatus.CREATED);

        const ledgerEntries = await this.ctx.pollUntil<Record<string, unknown>[]>(
          () =>
            this.ctx.dataSource.query(
              'SELECT * FROM ledger_entry WHERE correlation_id = ? ORDER BY action',
              ['e2e00000-0000-4000-8000-000000000024'],
            ),
          (rows) => rows.length >= 2,
        );

        const actual = {
          db: {
            product: await this.ctx.dataSource.query('SELECT * FROM product WHERE id = 103'),
            ledger_entry: ledgerEntries,
          },
          cache: { keys: await this.ctx.redis.keys('acme:catalog:*') },
        };

        expect(actual).toMatchSnapshot({
          db: {
            product: [{ updated_at: expect.any(Date) }],
            ledger_entry: [
              {
                id: expect.any(String),
                operation_key: expect.any(String),
                subject_id: expect.any(String),
                occurred_at: expect.any(Date),
                recorded_at: expect.any(Date),
                payload: {
                  orderProducts: [
                    { id: expect.any(String) },
                    { id: expect.any(String) },
                    { id: expect.any(String) },
                  ],
                },
              },
              {
                id: expect.any(String),
                occurred_at: expect.any(Date),
                recorded_at: expect.any(Date),
              },
            ],
          },
        });
        expect(actual).toMatchObject({
          db: {
            ledger_entry: [
              { operation_key: `order-placed:${response.body.id}`, subject_id: response.body.id },
              {},
            ],
          },
        });
      });
    });
  }
}
