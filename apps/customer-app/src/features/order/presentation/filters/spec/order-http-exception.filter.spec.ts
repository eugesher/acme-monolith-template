import { HttpException, type ArgumentsHost } from '@nestjs/common';

import { HttpExceptionFilter } from '@acme-libs/http';
import { makePinoLoggerMock } from '@acme-libs/testing';

import {
  OrderEmptyException,
  OrderIdempotencyKeyReusedException,
  OrderIdempotentRequestInFlightException,
  OrderNotFoundException,
  OrderProductNotFoundException,
  OrderStockInsufficientException,
} from '../../../domain';
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
    ['ORDER_EMPTY', 400, new OrderEmptyException('domain message')],
    ['ORDER_NOT_FOUND', 404, new OrderNotFoundException('600', 'domain message')],
    [
      'ORDER_STOCK_INSUFFICIENT',
      409,
      new OrderStockInsufficientException('100', 9, 8, 'domain message'),
    ],
    [
      'IDEMPOTENT_REQUEST_IN_FLIGHT',
      409,
      new OrderIdempotentRequestInFlightException('key-1', 'domain message'),
    ],
    [
      'IDEMPOTENCY_KEY_REUSED',
      422,
      new OrderIdempotencyKeyReusedException('key-1', 'domain message'),
    ],
    ['ORDER_PRODUCT_NOT_FOUND', 422, new OrderProductNotFoundException('100', 'domain message')],
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

  it('adds the details of the exception to the body', () => {
    filter.catch(
      new OrderStockInsufficientException('100', 9, 8, 'domain message'),
      {} as ArgumentsHost,
    );

    const [error] = baseCatch.mock.calls[0];

    expect(error.getResponse()).toEqual({
      statusCode: 409,
      message: 'domain message',
      code: 'ORDER_STOCK_INSUFFICIENT',
      details: { productId: '100', requested: 9, available: 8 },
    });
  });
});
