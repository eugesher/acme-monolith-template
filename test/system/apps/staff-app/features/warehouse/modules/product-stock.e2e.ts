import { HttpStatus } from '@nestjs/common';
import request from 'supertest';

import type { AppE2EContext } from '../../../context/app-e2e.context';

export class ProductStockE2E {
  private constructor(private readonly ctx: AppE2EContext) {}

  public static of(ctx: AppE2EContext): ProductStockE2E {
    return new ProductStockE2E(ctx);
  }

  public handleAdd(): void {
    describe('POST /api/warehouse/product-stock/:productId/add', () => {
      it('should add the units and append the ledger entry of the stock row', async () => {
        const [{ lastId }] = await this.ctx.dataSource.query(
          'SELECT MAX(id) AS lastId FROM product_stock',
        );

        await request(this.ctx.app.getHttpServer())
          .post('/api/warehouse/product-stock/106/add')
          .set('Idempotency-Key', 'system-restock-key')
          .set('x-correlation-id', 'e2e00000-0000-4000-8000-000000000019')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .send({ quantity: 5 })
          .expect(HttpStatus.OK);

        const [{ id: stockId }] = await this.ctx.dataSource.query(
          'SELECT id FROM product_stock WHERE id > ?',
          [lastId],
        );
        const actual = {
          db: {
            ledger_entry: await this.ctx.pollUntil<Record<string, unknown>[]>(
              () =>
                this.ctx.dataSource.query('SELECT * FROM ledger_entry WHERE correlation_id = ?', [
                  'e2e00000-0000-4000-8000-000000000019',
                ]),
              (rows) => rows.length >= 1,
            ),
          },
        };

        expect(actual).toMatchSnapshot({
          db: {
            ledger_entry: [
              {
                id: expect.any(String),
                operation_key: expect.any(String),
                occurred_at: expect.any(Date),
                recorded_at: expect.any(Date),
              },
            ],
          },
        });
        expect(actual.db.ledger_entry[0].operation_key).toBe(`product-restocked:${stockId}`);
      });
    });
  }
}
