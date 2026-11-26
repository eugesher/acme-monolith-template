import { HttpException, type ArgumentsHost } from '@nestjs/common';

import { HttpExceptionFilter } from '@acme-libs/http';
import { makePinoLoggerMock } from '@acme-libs/testing';

import { OrderNotFoundException, OrderTagNotFoundException } from '../../../domain';
import { OrderHttpExceptionFilter } from '../order-http-exception.filter';

describe('OrderHttpExceptionFilter', () => {
  let baseCatch: jest.SpyInstance<void, [HttpException, ArgumentsHost]>;
  let filter: OrderHttpExceptionFilter;

  beforeEach(() => {
    baseCatch = jest
      .spyOn(HttpExceptionFilter.prototype, 'catch')
      .mockImplementation(() => undefined) as unknown as jest.SpyInstance<
      void,
      [HttpException, ArgumentsHost]
    >;
    filter = new OrderHttpExceptionFilter(
      {} as ConstructorParameters<typeof OrderHttpExceptionFilter>[0],
      makePinoLoggerMock(),
    );
  });

  it('hands the HttpException over together with the same host', () => {
    const host = {} as ArgumentsHost;

    filter.catch(new OrderNotFoundException('600'), host);

    expect(baseCatch).toHaveBeenCalledTimes(1);
    expect(baseCatch).toHaveBeenCalledWith(expect.any(HttpException), host);
  });

  it.each([
    ['ORDER_NOT_FOUND', 404, new OrderNotFoundException('600', 'domain message')],
    ['ORDER_TAG_NOT_FOUND', 422, new OrderTagNotFoundException(['999'], 'domain message')],
  ])(
    'maps %s to %i with the code and the domain message in the body',
    (code, status, exception) => {
      filter.catch(exception, {} as ArgumentsHost);

      const [error] = baseCatch.mock.calls[0];

      expect(error.getStatus()).toBe(status);
      expect(error.getResponse()).toMatchObject({
        statusCode: status,
        message: 'domain message',
        code,
      });
    },
  );

  it('answers the body without details when the exception has none', () => {
    filter.catch(new OrderNotFoundException('600', 'domain message'), {} as ArgumentsHost);

    const [error] = baseCatch.mock.calls[0];

    expect(error.getResponse()).toEqual({
      statusCode: 404,
      message: 'domain message',
      code: 'ORDER_NOT_FOUND',
    });
  });

  it('adds the missing tags to the body', () => {
    filter.catch(new OrderTagNotFoundException(['998', '999']), {} as ArgumentsHost);

    const [error] = baseCatch.mock.calls[0];

    expect(error.getResponse()).toEqual({
      statusCode: 422,
      message: 'Some of the tags do not exist',
      code: 'ORDER_TAG_NOT_FOUND',
      details: { missingTagIds: ['998', '999'] },
    });
  });
});
