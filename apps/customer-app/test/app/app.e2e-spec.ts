import { HealthE2E } from '@acme-libs/testing';

import { AppE2EContext } from '../context/app-e2e.context';
import { AuthE2E, CatalogE2E, OrderE2E } from '../features';

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

  it('should validate each route with these DTOs of its path, query and body', () => {
    expect(ctx.routeDtos()).toEqual([
      ['POST /api/auth/login', 'AuthLoginRequestDto'],
      ['GET /api/auth/me'],
      ['POST /api/auth/register', 'AuthRegisterRequestDto'],
      ['GET /api/health'],
      ['GET /api/health/ready'],
      ['GET /api/orders', 'OrderGetListQueryDto'],
      ['POST /api/orders', 'OrderPlaceRequestDto'],
      ['GET /api/orders/:orderId', 'OrderIdParamDto'],
      ['GET /api/products', 'CatalogGetProductListQueryDto'],
    ]);
  });

  describe('Health', () => {
    healthE2E.liveness();
    healthE2E.readiness();
  });

  describe('Auth', () => {
    authE2E.register();
    authE2E.login();
    authE2E.me();
  });

  describe('Catalog', () => {
    catalogE2E.hooks();
    catalogE2E.getProductList();
  });

  describe('Order', () => {
    orderE2E.place();
    orderE2E.getList();
    orderE2E.getDetails();
  });
});
