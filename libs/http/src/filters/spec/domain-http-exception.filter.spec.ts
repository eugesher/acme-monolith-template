import { Catch, HttpException, HttpStatus, type ArgumentsHost } from '@nestjs/common';
import type { HttpAdapterHost } from '@nestjs/core';

import { DomainException } from '@acme-libs/domain';
import { makePinoLoggerMock } from '@acme-libs/testing';

import { DomainHttpExceptionFilter } from '../domain-http-exception.filter';
import { HttpExceptionFilter } from '../http-exception.filter';

describe('DomainHttpExceptionFilter', () => {
  class ItemVersionMismatchException extends DomainException {
    public readonly code = 'VERSION_MISMATCH';

    constructor() {
      super('Item 7 changed', { currentVersion: 4 });
    }
  }

  class ItemUnmappedException extends DomainException {
    public readonly code = 'ITEM_UNMAPPED';

    constructor() {
      super('Item 7 is unmapped');
    }
  }

  @Catch(ItemVersionMismatchException)
  class ItemHttpExceptionFilter extends DomainHttpExceptionFilter<ItemVersionMismatchException> {
    protected override readonly status = { VERSION_MISMATCH: HttpStatus.CONFLICT };
  }

  let catchSpy: jest.SpyInstance<void, [unknown, ArgumentsHost]>;
  let filter: ItemHttpExceptionFilter;

  beforeEach(() => {
    catchSpy = jest
      .spyOn(HttpExceptionFilter.prototype, 'catch')
      .mockImplementation(() => undefined);
    filter = new ItemHttpExceptionFilter({} as HttpAdapterHost, makePinoLoggerMock());
  });

  it('hands the base filter an HttpException of the mapped status with the code, the message and the details', () => {
    const host = {} as ArgumentsHost;

    filter.catch(new ItemVersionMismatchException(), host);

    const [error, handedHost] = catchSpy.mock.calls[0];

    expect(handedHost).toBe(host);
    expect(error).toBeInstanceOf(HttpException);
    expect((error as HttpException).getStatus()).toBe(409);
    expect((error as HttpException).getResponse()).toEqual({
      statusCode: 409,
      code: 'VERSION_MISMATCH',
      message: 'Item 7 changed',
      details: { currentVersion: 4 },
    });
  });

  it.each([
    ['a domain exception without a status', new ItemUnmappedException()],
    ['an error that is not a domain exception', new Error('boom')],
  ])('hands the base filter %s as it is', (_, exception) => {
    filter.catch(exception, {} as ArgumentsHost);

    expect(catchSpy).toHaveBeenCalledWith(exception, {});
  });
});
