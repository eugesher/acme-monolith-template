import { AppE2EContext } from '../context/app-e2e.context';
import { AuthE2E, CatalogE2E, HealthE2E, OrderE2E } from '../features';

describe('App', () => {
  jest.setTimeout(90000);

  const ctx = new AppE2EContext();

  const healthE2E = HealthE2E.of(ctx);
  const authE2E = AuthE2E.of(ctx);
  const catalogE2E = CatalogE2E.of(ctx);
  const orderE2E = OrderE2E.of(ctx);

  beforeAll(async () => {
    await ctx.init();
  });

  afterEach(() => {
    expect(ctx.takeRootWarnings()).toEqual([]);
  });

  afterAll(async () => {
    await ctx.close();
  });

  it('should mount these routes, each behind its access', () => {
    expect(ctx.routeAccess()).toEqual([
      ['POST /api/auth/login', 'public'],
      ['GET /api/auth/me', 'authenticated'],
      ['POST /api/auth/register', 'public'],
      ['GET /api/health', 'public'],
      ['GET /api/health/ready', 'public'],
      ['GET /api/orders', 'authenticated'],
      ['POST /api/orders', 'authenticated'],
      ['GET /api/orders/:orderId', 'authenticated'],
      ['GET /api/products', 'authenticated'],
    ]);
  });

  describe('Health', () => {
    healthE2E.handleLiveness();
    healthE2E.handleReadiness();
  });

  describe('Auth', () => {
    authE2E.handleRegister();
    authE2E.handleLogin();
    authE2E.handleMe();
  });

  describe('Catalog', () => {
    catalogE2E.hooks();
    catalogE2E.handleProductList();
  });

  describe('Order', () => {
    orderE2E.handlePlace();
    orderE2E.handleGetMany();
    orderE2E.handleGetOne();
  });
});
