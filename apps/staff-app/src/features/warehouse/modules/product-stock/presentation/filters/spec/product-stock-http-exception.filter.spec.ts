import { HttpException, type ArgumentsHost } from '@nestjs/common';

import { HttpExceptionFilter } from '@acme-libs/http';
import { makePinoLoggerMock } from '@acme-libs/testing';

import {
  ProductStockIdempotencyKeyReusedException,
  ProductStockIdempotentRequestInFlightException,
  ProductStockProductNotFoundException,
  ProductStockQuantityInvalidException,
} from '../../../domain';
import { ProductStockHttpExceptionFilter } from '../product-stock-http-exception.filter';

describe('ProductStockHttpExceptionFilter', () => {
  let baseCatch: jest.SpyInstance<void, [HttpException, ArgumentsHost]>;
  let filter: ProductStockHttpExceptionFilter;

  beforeEach(() => {
    baseCatch = jest
      .spyOn(HttpExceptionFilter.prototype, 'catch')
      .mockImplementation(() => undefined) as unknown as jest.SpyInstance<
      void,
      [HttpException, ArgumentsHost]
    >;
    filter = new ProductStockHttpExceptionFilter(
      {} as ConstructorParameters<typeof ProductStockHttpExceptionFilter>[0],
      makePinoLoggerMock(),
    );
  });

  it('hands the HttpException over together with the same host', () => {
    const host = {} as ArgumentsHost;

    filter.catch(new ProductStockIdempotentRequestInFlightException('key-1'), host);

    expect(baseCatch).toHaveBeenCalledTimes(1);
    expect(baseCatch).toHaveBeenCalledWith(expect.any(HttpException), host);
  });

  it.each([
    [
      'PRODUCT_STOCK_QUANTITY_INVALID',
      400,
      new ProductStockQuantityInvalidException(1000, 0, 'domain message'),
    ],
    [
      'PRODUCT_STOCK_PRODUCT_NOT_FOUND',
      404,
      new ProductStockProductNotFoundException('100', 'domain message'),
    ],
    [
      'IDEMPOTENT_REQUEST_IN_FLIGHT',
      409,
      new ProductStockIdempotentRequestInFlightException('key-1', 'domain message'),
    ],
    [
      'IDEMPOTENCY_KEY_REUSED',
      422,
      new ProductStockIdempotencyKeyReusedException('key-1', 'domain message'),
    ],
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
