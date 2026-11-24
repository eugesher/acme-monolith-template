import { HttpStatus } from '@nestjs/common';
import request from 'supertest';

import type { AppE2EContext } from '../../../context/app-e2e.context';

export class ProductE2E {
  private constructor(private readonly ctx: AppE2EContext) {}

  public static of(ctx: AppE2EContext): ProductE2E {
    return new ProductE2E(ctx);
  }

  public handleGetMany(): void {
    describe('GET /api/catalog/products', () => {
      it('should list the catalog, newest first', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .get('/api/catalog/products')
          .auth(this.ctx.viewerToken, { type: 'bearer' })
          .expect(HttpStatus.OK);

        expect({ response: { body: response.body } }).toMatchSnapshot();
      });

      it('should list only the products that carry the tag', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .get('/api/catalog/products')
          .query({ tagId: '300' })
          .auth(this.ctx.viewerToken, { type: 'bearer' })
          .expect(HttpStatus.OK);

        expect({ response: { body: response.body } }).toMatchSnapshot();
      });

      it('should answer an empty page for a tag no product carries', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .get('/api/catalog/products')
          .query({ tagId: '302' })
          .auth(this.ctx.viewerToken, { type: 'bearer' })
          .expect(HttpStatus.OK);

        expect(response.body).toEqual({
          page: 1,
          limit: 20,
          count: 0,
          pageCount: 0,
          total: 0,
          data: [],
        });
      });
    });
  }

  public handleGetOne(): void {
    describe('GET /api/catalog/products/:productId', () => {
      it('should read a product', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .get('/api/catalog/products/102')
          .auth(this.ctx.viewerToken, { type: 'bearer' })
          .expect(HttpStatus.OK);

        expect({ response: { body: response.body } }).toMatchSnapshot();
      });

      it('should answer an unknown product with 404', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .get('/api/catalog/products/999')
          .auth(this.ctx.viewerToken, { type: 'bearer' })
          .expect(HttpStatus.NOT_FOUND);

        expect({ response: { body: response.body } }).toMatchSnapshot();
      });
    });
  }

  public handleCreate(): void {
    describe('POST /api/catalog/products', () => {
      it('should create a draft and queue the ledger record under the correlation id', async () => {
        const [{ lastId }] = await this.ctx.dataSource.query(
          'SELECT MAX(id) AS lastId FROM product',
        );

        const response = await request(this.ctx.app.getHttpServer())
          .post('/api/catalog/products')
          .set('x-correlation-id', 'e2e00000-0000-4000-8000-000000000014')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .send({ sku: 'E2E-0001', name: 'Created product' })
          .expect(HttpStatus.CREATED);

        const records = await this.ctx.takeLedgerRecords();

        const actual = {
          response: { body: response.body },
          db: {
            product: await this.ctx.dataSource.query(
              'SELECT * FROM product WHERE id > ? ORDER BY id',
              [lastId],
            ),
          },
          ledger_record_queue: records.filter((record) => record.subjectId === response.body.id),
        };

        expect(actual).toMatchSnapshot({
          response: {
            body: {
              id: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          },
          db: {
            product: [
              {
                id: expect.any(String),
                created_at: expect.any(Date),
                updated_at: expect.any(Date),
              },
            ],
          },
          ledger_record_queue: [
            {
              operationKey: expect.any(String),
              subjectId: expect.any(String),
              occurredAt: expect.any(String),
            },
          ],
        });
        expect(actual).toMatchObject({
          db: { product: [{ id: response.body.id }] },
          ledger_record_queue: [
            {
              operationKey: `product-created:${response.body.id}`,
              subjectId: response.body.id,
            },
          ],
        });
        expect(Number(response.body.id)).toBeGreaterThan(Number(lastId));
      });

      it('should refuse a taken sku with 409', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .post('/api/catalog/products')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .send({ sku: 'SKU-0001', name: 'Taken sku' })
          .expect(HttpStatus.CONFLICT);

        expect({
          response: { body: response.body },
          db: {
            product: await this.ctx.dataSource.query('SELECT id, name FROM product WHERE sku = ?', [
              'SKU-0001',
            ]),
          },
        }).toMatchSnapshot();
      });
    });
  }

  public handleUpdate(): void {
    describe('PATCH /api/catalog/products/:productId', () => {
      it('should update the name with a quoted If-Match, bump the version and drop the cached customer catalog', async () => {
        await this.ctx.redis.set('acme:catalog:v1:page:1:limit:20', '{}');

        const response = await request(this.ctx.app.getHttpServer())
          .patch('/api/catalog/products/102')
          .set('If-Match', '"1"')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .send({ name: 'Renamed product' })
          .expect(HttpStatus.OK);

        expect({
          response: { body: response.body },
          db: { product: await this.ctx.dataSource.query('SELECT * FROM product WHERE id = 102') },
          cache: { keys: await this.ctx.redis.keys('acme:catalog:*') },
        }).toMatchSnapshot({
          response: { body: { updatedAt: expect.any(String) } },
          db: { product: [{ updated_at: expect.any(Date) }] },
        });
      });

      it('should keep the product as is for a body without fields', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .patch('/api/catalog/products/101')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .send({})
          .expect(HttpStatus.OK);

        expect({
          response: { body: response.body },
          db: { product: await this.ctx.dataSource.query('SELECT * FROM product WHERE id = 101') },
        }).toMatchSnapshot();
      });

      it('should refuse a stale If-Match with 412 and the current version', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .patch('/api/catalog/products/101')
          .set('If-Match', '0')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .send({ name: 'Stale update' })
          .expect(HttpStatus.PRECONDITION_FAILED);

        expect({
          response: { body: response.body },
          db: { product: await this.ctx.dataSource.query('SELECT * FROM product WHERE id = 101') },
        }).toMatchSnapshot();
      });

      it('should refuse a malformed If-Match with 400', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .patch('/api/catalog/products/101')
          .set('If-Match', 'not-a-number')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .send({ name: 'Malformed update' })
          .expect(HttpStatus.BAD_REQUEST);

        expect({ response: { body: response.body } }).toMatchSnapshot();
      });

      it('should apply every one of concurrent updates without If-Match', async () => {
        const responses = await Promise.all(
          [1, 2, 3, 4, 5].map((index) =>
            request(this.ctx.app.getHttpServer())
              .patch('/api/catalog/products/104')
              .auth(this.ctx.editorToken, { type: 'bearer' })
              .send({ name: `Concurrent update ${index}` }),
          ),
        );

        expect({
          statuses: responses.map((response) => response.status),
          db: {
            product: await this.ctx.dataSource.query(
              'SELECT id, version FROM product WHERE id = 104',
            ),
          },
        }).toMatchSnapshot();
      });
    });
  }

  public handleArchive(): void {
    describe('POST /api/catalog/products/:productId/archive', () => {
      it('should archive, queue one ledger record under the correlation id and drop the cached customer catalog', async () => {
        await this.ctx.redis.set('acme:catalog:v1:page:1:limit:20', '{}');

        const response = await request(this.ctx.app.getHttpServer())
          .post('/api/catalog/products/103/archive')
          .set('If-Match', '1')
          .set('x-correlation-id', 'e2e00000-0000-4000-8000-000000000015')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .expect(HttpStatus.OK);

        const records = await this.ctx.takeLedgerRecords();

        expect({
          response: { body: response.body },
          db: {
            product: await this.ctx.dataSource.query('SELECT * FROM product WHERE id = 103'),
          },
          ledger_record_queue: records,
          cache: { keys: await this.ctx.redis.keys('acme:catalog:*') },
        }).toMatchSnapshot({
          response: { body: { updatedAt: expect.any(String) } },
          db: { product: [{ updated_at: expect.any(Date) }] },
          ledger_record_queue: [{ occurredAt: expect.any(String) }],
        });
      });

      it('should refuse to archive an archived product with 409', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .post('/api/catalog/products/105/archive')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .expect(HttpStatus.CONFLICT);

        expect({
          response: { body: response.body },
          db: {
            product: await this.ctx.dataSource.query('SELECT * FROM product WHERE id = 105'),
          },
          ledger_record_queue: await this.ctx.takeLedgerRecords(),
        }).toMatchSnapshot();
      });
    });
  }

  public handlePublish(): void {
    describe('POST /api/catalog/products/:productId/publish', () => {
      it('should publish a draft, queue one ledger record under the correlation id and drop the cached customer catalog', async () => {
        await this.ctx.redis.set('acme:catalog:v1:page:1:limit:20', '{}');

        const response = await request(this.ctx.app.getHttpServer())
          .post('/api/catalog/products/101/publish')
          .set('If-Match', '1')
          .set('x-correlation-id', 'e2e00000-0000-4000-8000-000000000016')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .expect(HttpStatus.OK);

        const records = await this.ctx.takeLedgerRecords();

        expect({
          response: { body: response.body },
          db: {
            product: await this.ctx.dataSource.query('SELECT * FROM product WHERE id = 101'),
          },
          ledger_record_queue: records,
          cache: { keys: await this.ctx.redis.keys('acme:catalog:*') },
        }).toMatchSnapshot({
          response: { body: { updatedAt: expect.any(String) } },
          db: { product: [{ updated_at: expect.any(Date) }] },
          ledger_record_queue: [{ occurredAt: expect.any(String) }],
        });
      });

      it('should keep a published product as is and queue nothing', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .post('/api/catalog/products/100/publish')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .expect(HttpStatus.OK);

        expect({
          response: { body: response.body },
          db: {
            product: await this.ctx.dataSource.query('SELECT * FROM product WHERE id = 100'),
          },
          ledger_record_queue: await this.ctx.takeLedgerRecords(),
        }).toMatchSnapshot();
      });

      it('should publish an archived product again under a ledger record of its new version', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .post('/api/catalog/products/105/publish')
          .set('x-correlation-id', 'e2e00000-0000-4000-8000-000000000017')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .expect(HttpStatus.OK);

        expect({
          response: { body: response.body },
          db: {
            product: await this.ctx.dataSource.query('SELECT * FROM product WHERE id = 105'),
          },
          ledger_record_queue: await this.ctx.takeLedgerRecords(),
        }).toMatchSnapshot({
          response: { body: { updatedAt: expect.any(String) } },
          db: { product: [{ updated_at: expect.any(Date) }] },
          ledger_record_queue: [{ occurredAt: expect.any(String) }],
        });
      });

      it('should answer 404 for an unknown product', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .post('/api/catalog/products/999/publish')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .expect(HttpStatus.NOT_FOUND);

        expect({ response: { body: response.body } }).toMatchSnapshot();
      });
    });
  }

  public handleGetTags(): void {
    describe('GET /api/catalog/products/:productId/tags', () => {
      it('should read the tags of the product, by name', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .get('/api/catalog/products/100/tags')
          .auth(this.ctx.viewerToken, { type: 'bearer' })
          .expect(HttpStatus.OK);

        expect({ response: { body: response.body } }).toMatchSnapshot();
      });

      it('should answer an empty list for a product without tags', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .get('/api/catalog/products/103/tags')
          .auth(this.ctx.viewerToken, { type: 'bearer' })
          .expect(HttpStatus.OK);

        expect(response.body).toEqual({ tags: [] });
      });

      it('should answer an unknown product with 404', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .get('/api/catalog/products/999/tags')
          .auth(this.ctx.viewerToken, { type: 'bearer' })
          .expect(HttpStatus.NOT_FOUND);

        expect({ response: { body: response.body } }).toMatchSnapshot();
      });
    });
  }

  public handleReplaceTags(): void {
    describe('PUT /api/catalog/products/:productId/tags', () => {
      afterEach(async () => {
        await this.ctx.dataSource.query(
          "DELETE FROM tag_subject WHERE subject_type = 'product' AND subject_id = 103",
        );
      });

      it('should link the tags of the body and answer them by name', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .put('/api/catalog/products/103/tags')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .send({ tagIds: ['301', '300', '300'] })
          .expect(HttpStatus.OK);

        const actual = {
          response: { body: response.body },
          db: {
            tag_subject: await this.ctx.dataSource.query(
              "SELECT tag_id, subject_type, subject_id FROM tag_subject WHERE subject_type = 'product' AND subject_id = 103 ORDER BY tag_id",
            ),
          },
        };

        expect(actual).toMatchSnapshot();
      });

      it('should replace the tags the product had and clear them with an empty list', async () => {
        await request(this.ctx.app.getHttpServer())
          .put('/api/catalog/products/103/tags')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .send({ tagIds: ['300', '301'] })
          .expect(HttpStatus.OK);

        const replaced = await request(this.ctx.app.getHttpServer())
          .put('/api/catalog/products/103/tags')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .send({ tagIds: ['301'] })
          .expect(HttpStatus.OK);
        const cleared = await request(this.ctx.app.getHttpServer())
          .put('/api/catalog/products/103/tags')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .send({ tagIds: [] })
          .expect(HttpStatus.OK);

        expect({
          replaced: replaced.body,
          cleared: cleared.body,
          db: {
            tag_subject: await this.ctx.dataSource.query(
              "SELECT * FROM tag_subject WHERE subject_type = 'product' AND subject_id = 103",
            ),
          },
        }).toMatchSnapshot();
      });

      it('should refuse an unknown tag with 422 and keep the tags the product had', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .put('/api/catalog/products/100/tags')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .send({ tagIds: ['300', '998', '999'] })
          .expect(HttpStatus.UNPROCESSABLE_ENTITY);

        const tags = await request(this.ctx.app.getHttpServer())
          .get('/api/catalog/products/100/tags')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .expect(HttpStatus.OK);

        expect({ response: { body: response.body }, tags: tags.body }).toMatchSnapshot();
      });

      it('should answer an unknown product with 404', async () => {
        const response = await request(this.ctx.app.getHttpServer())
          .put('/api/catalog/products/999/tags')
          .auth(this.ctx.editorToken, { type: 'bearer' })
          .send({ tagIds: ['300'] })
          .expect(HttpStatus.NOT_FOUND);

        expect({ response: { body: response.body } }).toMatchSnapshot();
      });
    });
  }
}
