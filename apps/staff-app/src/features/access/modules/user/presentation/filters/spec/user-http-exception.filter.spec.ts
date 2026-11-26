import { HttpException, type ArgumentsHost } from '@nestjs/common';

import { HttpExceptionFilter } from '@acme-libs/http';
import { makePinoLoggerMock } from '@acme-libs/testing';

import {
  UserEmailInvalidException,
  UserEmailTakenException,
  UserNotFoundException,
  UserPasswordTooWeakException,
  UserRoleNotFoundException,
} from '../../../domain';
import { UserHttpExceptionFilter } from '../user-http-exception.filter';

describe('UserHttpExceptionFilter', () => {
  let baseCatch: jest.SpyInstance<void, [HttpException, ArgumentsHost]>;
  let filter: UserHttpExceptionFilter;

  beforeEach(() => {
    baseCatch = jest
      .spyOn(HttpExceptionFilter.prototype, 'catch')
      .mockImplementation(() => undefined) as unknown as jest.SpyInstance<
      void,
      [HttpException, ArgumentsHost]
    >;
    filter = new UserHttpExceptionFilter(
      {} as ConstructorParameters<typeof UserHttpExceptionFilter>[0],
      makePinoLoggerMock(),
    );
  });

  it('hands the HttpException over together with the same host', () => {
    const host = {} as ArgumentsHost;

    filter.catch(new UserRoleNotFoundException('1'), host);

    expect(baseCatch).toHaveBeenCalledTimes(1);
    expect(baseCatch).toHaveBeenCalledWith(expect.any(HttpException), host);
  });

  it.each([
    ['AUTH_EMAIL_INVALID', 400, new UserEmailInvalidException('domain message')],
    ['AUTH_PASSWORD_TOO_WEAK', 400, new UserPasswordTooWeakException(12, 'domain message')],
    ['AUTH_USER_NOT_FOUND', 404, new UserNotFoundException('1', 'domain message')],
    ['AUTH_EMAIL_TAKEN', 409, new UserEmailTakenException('domain message')],
    ['AUTH_ROLE_NOT_FOUND', 422, new UserRoleNotFoundException('admin', 'domain message')],
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
