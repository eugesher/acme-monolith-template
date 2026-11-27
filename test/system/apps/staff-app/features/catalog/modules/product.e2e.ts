import { HttpStatus } from '@nestjs/common';
import request from 'supertest';

import type { AppE2EContext } from '../../../context/app-e2e.context';

export class ProductE2E {
  private constructor(private readonly ctx: AppE2EContext) {}

  public static of(ctx: AppE2EContext): ProductE2E {
    return new ProductE2E(ctx);
  }

  public create(): void {
    describe('POST /api/catalog/products', () => {
      it('should create a draft and append its ledger entry under the correlation id', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .post('/api/catalog/products')
          .set('x-correlation-id', 'e2e00000-0000-4000-8000-000000000020')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .send({ sku: 'SYS-0001', name: 'Created product' })
          .expect(HttpStatus.CREATED);

        const actual = {
          db: {
            ledger_entry: await this.ctx.pollUntil<Record<string, unknown>[]>(
              () =>
                this.ctx.dataSource.query('SELECT * FROM ledger_entry WHERE correlation_id = ?', [
                  'e2e00000-0000-4000-8000-000000000020',
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
                subject_id: expect.any(String),
                occurred_at: expect.any(Date),
                recorded_at: expect.any(Date),
              },
            ],
          },
        });
        expect(actual).toMatchObject({
          db: {
            ledger_entry: [
              {
                operation_key: `product-created:${response.body.id}`,
                subject_id: response.body.id,
              },
            ],
          },
        });
      });
    });
  }

  public archive(): void {
    describe('POST /api/catalog/products/:productId/archive', () => {
      it('should append the ledger entry of the archive under the correlation id', async () => {
        await request(this.ctx.app.getHttpServer())
          .post('/api/catalog/products/103/archive')
          .set('If-Match', '1')
          .set('x-correlation-id', 'e2e00000-0000-4000-8000-000000000021')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .expect(HttpStatus.OK);

        expect({
          db: {
            ledger_entry: await this.ctx.pollUntil<Record<string, unknown>[]>(
              () =>
                this.ctx.dataSource.query('SELECT * FROM ledger_entry WHERE correlation_id = ?', [
                  'e2e00000-0000-4000-8000-000000000021',
                ]),
              (rows) => rows.length >= 1,
            ),
          },
        }).toMatchSnapshot({
          db: {
            ledger_entry: [
              {
                id: expect.any(String),
                occurred_at: expect.any(Date),
                recorded_at: expect.any(Date),
              },
            ],
          },
        });
      });
    });
  }

  public publish(): void {
    describe('POST /api/catalog/products/:productId/publish', () => {
      it('should append the ledger entry of the publication under the correlation id', async () => {
        await request(this.ctx.app.getHttpServer())
          .post('/api/catalog/products/101/publish')
          .set('If-Match', '1')
          .set('x-correlation-id', 'e2e00000-0000-4000-8000-000000000022')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .expect(HttpStatus.OK);

        expect({
          db: {
            ledger_entry: await this.ctx.pollUntil<Record<string, unknown>[]>(
              () =>
                this.ctx.dataSource.query('SELECT * FROM ledger_entry WHERE correlation_id = ?', [
                  'e2e00000-0000-4000-8000-000000000022',
                ]),
              (rows) => rows.length >= 1,
            ),
          },
        }).toMatchSnapshot({
          db: {
            ledger_entry: [
              {
                id: expect.any(String),
                occurred_at: expect.any(Date),
                recorded_at: expect.any(Date),
              },
            ],
          },
        });
      });
    });
  }
}
