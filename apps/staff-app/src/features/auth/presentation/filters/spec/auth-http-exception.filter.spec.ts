import { HttpException, type ArgumentsHost } from '@nestjs/common';

import { HttpExceptionFilter } from '@acme-libs/http';
import { makePinoLoggerMock } from '@acme-libs/testing';

import {
  AuthInvalidCredentialsException,
  AuthUserInactiveException,
  AuthUserNotFoundException,
} from '../../../domain';
import { AuthHttpExceptionFilter } from '../auth-http-exception.filter';

describe('AuthHttpExceptionFilter', () => {
  let baseCatch: jest.SpyInstance<void, [HttpException, ArgumentsHost]>;
  let filter: AuthHttpExceptionFilter;

  beforeEach(() => {
    baseCatch = jest
      .spyOn(HttpExceptionFilter.prototype, 'catch')
      .mockImplementation(() => undefined) as unknown as jest.SpyInstance<
      void,
      [HttpException, ArgumentsHost]
    >;
    filter = new AuthHttpExceptionFilter(
      {} as ConstructorParameters<typeof AuthHttpExceptionFilter>[0],
      makePinoLoggerMock(),
    );
  });

  it('hands the HttpException over together with the same host', () => {
    const host = {} as ArgumentsHost;

    filter.catch(new AuthInvalidCredentialsException(), host);

    expect(baseCatch).toHaveBeenCalledTimes(1);
    expect(baseCatch).toHaveBeenCalledWith(expect.any(HttpException), host);
  });

  it.each([
    ['AUTH_INVALID_CREDENTIALS', 401, new AuthInvalidCredentialsException('domain message')],
    ['AUTH_USER_INACTIVE', 403, new AuthUserInactiveException('1', 'domain message')],
    ['AUTH_USER_NOT_FOUND', 404, new AuthUserNotFoundException('1', 'domain message')],
  ])(
    'maps %s to %i with the code and the domain message in the body',
    (code, status, exception) => {
      filter.catch(exception, {} as ArgumentsHost);

      const [error] = baseCatch.mock.calls[0];

      expect(error.getStatus()).toBe(status);
      expect(error.getResponse()).toEqual({ statusCode: status, message: 'domain message', code });
    },
  );
});
