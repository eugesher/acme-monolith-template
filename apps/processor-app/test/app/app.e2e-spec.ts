import { AppE2EContext } from '../context/app-e2e.context';
import { HealthE2E } from '../features';
import { IdempotencyE2E, LedgerE2E, ProductStockE2E } from '../processors';

describe('App', () => {
  jest.setTimeout(90000);

  const ctx = new AppE2EContext();

  const healthE2E = HealthE2E.of(ctx);
  const ledgerE2E = LedgerE2E.of(ctx);
  const idempotencyE2E = IdempotencyE2E.of(ctx);
  const productStockE2E = ProductStockE2E.of(ctx);

  beforeAll(async () => {
    await ctx.init();
  });

  afterEach(() => {
    expect(ctx.takeRootWarnings()).toEqual([]);
  });

  afterAll(async () => {
    await ctx.close();
  });

  it('should mount the health routes alone', () => {
    expect(ctx.mountedRoutes()).toEqual(['GET /api/health', 'GET /api/health/ready']);
  });

  describe('Health', () => {
    healthE2E.handleLiveness();
    healthE2E.handleReadiness();
  });

  describe('Ledger', () => {
    ledgerE2E.process();
  });

  describe('Idempotency', () => {
    idempotencyE2E.onApplicationBootstrap();
    idempotencyE2E.process();
  });

  describe('ProductStock', () => {
    productStockE2E.process();
  });
});
