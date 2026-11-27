import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { SnakeNamingStrategy } from '@acme-libs/database';
import { HealthE2E } from '@acme-libs/testing';
import * as coreEntities from '@acme-core/entities';
import * as staffEntities from '@acme-staff/common/entities';

import { AppE2EContext } from '../context/app-e2e.context';
import {
  AccessE2E,
  AuthE2E,
  CatalogE2E,
  LedgerE2E,
  QueueE2E,
  SalesE2E,
  ToolsE2E,
  WarehouseE2E,
} from '../features';

describe('App', () => {
  jest.setTimeout(90000);

  const ctx = new AppE2EContext();

  const healthE2E = HealthE2E.of(ctx);
  const accessE2E = AccessE2E.of(ctx);
  const authE2E = AuthE2E.of(ctx);
  const ledgerE2E = LedgerE2E.of(ctx);
  const queueE2E = QueueE2E.of(ctx);
  const toolsE2E = ToolsE2E.of(ctx);
  const salesE2E = SalesE2E.of(ctx);
  const warehouseE2E = WarehouseE2E.of(ctx);
  const catalogE2E = CatalogE2E.of(ctx);

  beforeAll(async () => {
    await ctx.init();
  });

  afterEach(() => {
    expect(ctx.takeRootWarnings()).toEqual([]);
  });

  afterAll(async () => {
    await ctx.close();
  });

  it('should migrate the database to the schema of every entity', async () => {
    const config = ctx.moduleFixture.get(ConfigService);
    const dataSource = new DataSource({
      type: 'mysql',
      host: config.getOrThrow<string>('DATABASE_HOST'),
      port: config.getOrThrow<number>('DATABASE_PORT'),
      username: config.getOrThrow<string>('DATABASE_USER'),
      password: config.getOrThrow<string>('DATABASE_PASSWORD'),
      database: config.getOrThrow<string>('DATABASE_NAME'),
      entities: [...Object.values(coreEntities), ...Object.values(staffEntities)],
      namingStrategy: new SnakeNamingStrategy(),
    });

    await dataSource.initialize();

    try {
      const sql = await dataSource.driver.createSchemaBuilder().log();

      expect(sql.upQueries).toEqual([]);
    } finally {
      await dataSource.destroy();
    }
  });

  it('should mount these routes, each behind its access', () => {
    expect(ctx.routeAccess()).toEqual([
      ['GET /api/access/permissions', 'access:manage'],
      ['GET /api/access/roles', 'access:manage'],
      ['POST /api/access/roles', 'access:manage'],
      ['PUT /api/access/roles/:roleId/permissions', 'access:manage'],
      ['POST /api/access/users', 'access:manage'],
      ['PUT /api/access/users/:userId/roles', 'access:manage'],
      ['POST /api/auth/login', 'public'],
      ['GET /api/auth/me', 'authenticated'],
      ['GET /api/catalog/products', 'product:read'],
      ['POST /api/catalog/products', 'product:write'],
      ['GET /api/catalog/products/:productId', 'product:read'],
      ['PATCH /api/catalog/products/:productId', 'product:write'],
      ['POST /api/catalog/products/:productId/archive', 'product:archive'],
      ['POST /api/catalog/products/:productId/publish', 'product:write'],
      ['GET /api/catalog/products/:productId/tags', 'product:read'],
      ['PUT /api/catalog/products/:productId/tags', 'product:write'],
      ['GET /api/health', 'public'],
      ['GET /api/health/ready', 'public'],
      ['GET /api/ledger', 'ledger:read'],
      ['GET /api/queues', 'queue:read'],
      ['GET /api/queues/:queueName/jobs/failed', 'queue:read'],
      ['DELETE /api/queues/:queueName/jobs/failed/:jobId', 'queue:delete'],
      ['POST /api/queues/:queueName/jobs/failed/:jobId/retry', 'queue:retry'],
      ['GET /api/sales/orders', 'order:read'],
      ['GET /api/sales/orders/:orderId', 'order:read'],
      ['GET /api/sales/orders/:orderId/tags', 'order:read'],
      ['PUT /api/sales/orders/:orderId/tags', 'order:write'],
      ['GET /api/tools/notes', 'authenticated'],
      ['POST /api/tools/notes', 'authenticated'],
      ['DELETE /api/tools/notes/:noteId', 'authenticated'],
      ['GET /api/tools/notes/:noteId', 'authenticated'],
      ['PATCH /api/tools/notes/:noteId', 'authenticated'],
      ['POST /api/tools/notes/:noteId/resolve', 'authenticated'],
      ['GET /api/tools/notes/:noteId/revisions', 'authenticated'],
      ['GET /api/tools/tags', 'tag:read'],
      ['POST /api/tools/tags', 'tag:write'],
      ['DELETE /api/tools/tags/:tagId', 'tag:write'],
      ['PATCH /api/tools/tags/:tagId', 'tag:write'],
      ['POST /api/warehouse/product-stock/:productId/add', 'product:restock'],
    ]);
  });

  it('should validate each route with these DTOs of its path, query and body', () => {
    expect(ctx.routeDtos()).toEqual([
      ['GET /api/access/permissions'],
      ['GET /api/access/roles'],
      ['POST /api/access/roles', 'RoleCreateRequestDto'],
      [
        'PUT /api/access/roles/:roleId/permissions',
        'RoleIdParamDto',
        'RolePermissionsReassignRequestDto',
      ],
      ['POST /api/access/users', 'UserRegisterRequestDto'],
      ['PUT /api/access/users/:userId/roles', 'UserIdParamDto', 'UserRolesReassignRequestDto'],
      ['POST /api/auth/login', 'AuthLoginRequestDto'],
      ['GET /api/auth/me'],
      ['GET /api/catalog/products', 'ProductGetManyQueryDto'],
      ['POST /api/catalog/products', 'ProductCreateRequestDto'],
      ['GET /api/catalog/products/:productId', 'ProductIdParamDto'],
      ['PATCH /api/catalog/products/:productId', 'ProductIdParamDto', 'ProductUpdateRequestDto'],
      ['POST /api/catalog/products/:productId/archive', 'ProductIdParamDto'],
      ['POST /api/catalog/products/:productId/publish', 'ProductIdParamDto'],
      ['GET /api/catalog/products/:productId/tags', 'ProductIdParamDto'],
      [
        'PUT /api/catalog/products/:productId/tags',
        'ProductIdParamDto',
        'ProductTagsReplaceRequestDto',
      ],
      ['GET /api/health'],
      ['GET /api/health/ready'],
      ['GET /api/ledger', 'LedgerListEntriesQueryDto'],
      ['GET /api/queues'],
      [
        'GET /api/queues/:queueName/jobs/failed',
        'QueueNameParamDto',
        'QueueListFailedJobsQueryDto',
      ],
      ['DELETE /api/queues/:queueName/jobs/failed/:jobId', 'QueueJobParamDto'],
      ['POST /api/queues/:queueName/jobs/failed/:jobId/retry', 'QueueJobParamDto'],
      ['GET /api/sales/orders', 'OrderGetManyQueryDto'],
      ['GET /api/sales/orders/:orderId', 'OrderIdParamDto'],
      ['GET /api/sales/orders/:orderId/tags', 'OrderIdParamDto'],
      ['PUT /api/sales/orders/:orderId/tags', 'OrderIdParamDto', 'OrderTagsReplaceRequestDto'],
      ['GET /api/tools/notes', 'NoteGetManyQueryDto'],
      ['POST /api/tools/notes', 'NoteCreateRequestDto'],
      ['DELETE /api/tools/notes/:noteId', 'NoteIdParamDto'],
      ['GET /api/tools/notes/:noteId', 'NoteIdParamDto'],
      ['PATCH /api/tools/notes/:noteId', 'NoteIdParamDto', 'NoteUpdateRequestDto'],
      ['POST /api/tools/notes/:noteId/resolve', 'NoteIdParamDto'],
      ['GET /api/tools/notes/:noteId/revisions', 'NoteIdParamDto', 'NoteGetRevisionsQueryDto'],
      ['GET /api/tools/tags', 'TagGetManyQueryDto'],
      ['POST /api/tools/tags', 'TagCreateRequestDto'],
      ['DELETE /api/tools/tags/:tagId', 'TagIdParamDto'],
      ['PATCH /api/tools/tags/:tagId', 'TagIdParamDto', 'TagUpdateRequestDto'],
      [
        'POST /api/warehouse/product-stock/:productId/add',
        'ProductStockProductIdParamDto',
        'ProductStockAddRequestDto',
      ],
    ]);
  });

  describe('Health', () => {
    healthE2E.liveness();
    healthE2E.readiness();
  });

  describe('Auth', () => {
    authE2E.login();
    authE2E.me();
  });

  describe('Access', () => {
    accessE2E.execute();
  });

  describe('Ledger', () => {
    ledgerE2E.listEntries();
    ledgerE2E.appendEnqueue();
  });

  describe('Queue', () => {
    queueE2E.list();
    queueE2E.listFailedJobs();
    queueE2E.retryFailedJob();
    queueE2E.deleteFailedJob();
  });

  describe('Tools', () => {
    toolsE2E.execute();
  });

  describe('Sales', () => {
    salesE2E.execute();
  });

  describe('Warehouse', () => {
    warehouseE2E.execute();
  });

  describe('Catalog', () => {
    catalogE2E.execute();
  });
});
