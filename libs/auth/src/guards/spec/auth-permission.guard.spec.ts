import { ForbiddenException, type ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';

import { AuthPermissionGuard } from '../auth-permission.guard';

describe('AuthPermissionGuard', () => {
  let getAllAndOverride: jest.Mock;
  let request: Record<string, unknown>;
  let context: ExecutionContext;
  let guard: AuthPermissionGuard;

  beforeEach(() => {
    getAllAndOverride = jest.fn().mockReturnValue('product:write');
    request = { user: { id: 'user-1', permissionCodes: ['product:write'] } };
    context = {
      getHandler: () => 'handler',
      getClass: () => 'class',
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;
    guard = new AuthPermissionGuard({ getAllAndOverride } as unknown as Reflector);
  });

  it('admits a user holding a required permission', () => {
    const allowed = guard.canActivate(context);

    expect(allowed).toBe(true);
    expect(getAllAndOverride).toHaveBeenCalledWith('auth:permission', ['handler', 'class']);
  });

  it('lets a route without required permissions through', () => {
    getAllAndOverride.mockReturnValue(undefined);
    request = {};

    const allowed = guard.canActivate(context);

    expect(allowed).toBe(true);
  });

  it.each([
    [
      'a user holding none of the required permissions',
      { user: { id: 'user-1', permissionCodes: ['product:read'] } },
    ],
    ['a user whose validator gave no permissions', { user: { id: 'user-1' } }],
    ['an anonymous request on a gated route', {}],
  ])('refuses %s with 403', (_case, gatedRequest) => {
    request = gatedRequest;

    const canActivate = (): unknown => guard.canActivate(context);

    expect(canActivate).toThrow(ForbiddenException);
    expect(canActivate).toThrow(
      expect.objectContaining({
        response: { statusCode: 403, message: 'Insufficient permissions', error: 'Forbidden' },
      }) as Error,
    );
  });
});
