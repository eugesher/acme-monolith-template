import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';

import type { IAuthUserValidatorPort } from '@acme-libs/contracts/auth';

import { AuthJwtGuard } from '../auth-jwt.guard';

describe('AuthJwtGuard', () => {
  let validator: jest.Mocked<IAuthUserValidatorPort>;
  let getAllAndOverride: jest.Mock;
  let request: Record<string, unknown>;
  let context: ExecutionContext;
  let guard: AuthJwtGuard;

  beforeEach(() => {
    validator = { validateSubject: jest.fn() };
    validator.validateSubject.mockResolvedValue({ id: 'user-1', email: 'ann@example.com' });
    getAllAndOverride = jest.fn().mockReturnValue(undefined);
    request = { headers: { authorization: 'Bearer token' } };
    context = {
      getHandler: () => 'handler',
      getClass: () => 'class',
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;
    guard = new AuthJwtGuard(validator, { getAllAndOverride } as unknown as Reflector);
  });

  it('hands the bearer token to the validator and puts the user it answers on the request', async () => {
    const allowed = await guard.canActivate(context);

    expect(allowed).toBe(true);
    expect(validator.validateSubject).toHaveBeenCalledWith({ token: 'token' });
    expect(request.user).toEqual({
      id: 'user-1',
      email: 'ann@example.com',
    });
  });

  it('lets a public route in without looking at the token', async () => {
    getAllAndOverride.mockReturnValue(true);
    request.headers = {};

    const allowed = await guard.canActivate(context);

    expect(allowed).toBe(true);
    expect(getAllAndOverride).toHaveBeenCalledWith('auth:public', ['handler', 'class']);
    expect(validator.validateSubject).not.toHaveBeenCalled();
  });

  it('accepts the bearer scheme in any case', async () => {
    request.headers = { authorization: 'bEaReR token' };

    const allowed = await guard.canActivate(context);

    expect(allowed).toBe(true);
  });

  it.each([
    ['no authorization header', {}],
    ['another scheme', { authorization: 'Basic token' }],
    ['a scheme without a token', { authorization: 'Bearer' }],
  ])('rejects %s with 401', async (_case, headers) => {
    request.headers = headers;

    const allowed = guard.canActivate(context);

    await expect(allowed).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(allowed).rejects.toMatchObject({
      response: { statusCode: 401, message: 'Unauthorized' },
    });
    expect(validator.validateSubject).not.toHaveBeenCalled();
  });

  it('rejects a token the validator answers no user for with 401', async () => {
    validator.validateSubject.mockResolvedValue(null);

    const allowed = guard.canActivate(context);

    await expect(allowed).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(allowed).rejects.toMatchObject({
      response: { statusCode: 401, message: 'Unauthorized' },
    });
    expect(request.user).toBeUndefined();
  });
});
