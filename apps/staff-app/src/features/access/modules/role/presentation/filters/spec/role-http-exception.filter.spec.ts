import { HttpException, type ArgumentsHost } from '@nestjs/common';

import type { HttpExceptionFilter } from '@acme-libs/http';

import { RoleNameTakenException, RoleNotFoundException } from '../../../domain';
import { RoleHttpExceptionFilter } from '../role-http-exception.filter';

describe('RoleHttpExceptionFilter', () => {
  let httpExceptionFilter: { catch: jest.Mock<void, [HttpException, ArgumentsHost]> };
  let filter: RoleHttpExceptionFilter;

  beforeEach(() => {
    httpExceptionFilter = { catch: jest.fn() as jest.Mock<void, [HttpException, ArgumentsHost]> };
    filter = new RoleHttpExceptionFilter(httpExceptionFilter as unknown as HttpExceptionFilter);
  });

  it('hands the HttpException over together with the same host', () => {
    const host = {} as ArgumentsHost;

    filter.catch(new RoleNotFoundException('admin'), host);

    expect(httpExceptionFilter.catch).toHaveBeenCalledTimes(1);
    expect(httpExceptionFilter.catch).toHaveBeenCalledWith(expect.any(HttpException), host);
  });

  it.each([
    ['AUTH_ROLE_NOT_FOUND', 404, new RoleNotFoundException('admin', 'domain message')],
    ['AUTH_ROLE_NAME_TAKEN', 409, new RoleNameTakenException('admin', 'domain message')],
  ])(
    'maps %s to %i with the code and the domain message in the body',
    (code, status, exception) => {
      filter.catch(exception, {} as ArgumentsHost);

      const [error] = httpExceptionFilter.catch.mock.calls[0];

      expect(error.getStatus()).toBe(status);
      expect(error.getResponse()).toEqual({ statusCode: status, message: 'domain message', code });
    },
  );
});
