import { HttpException, type ArgumentsHost } from '@nestjs/common';

import { HttpExceptionFilter } from '@acme-libs/http';
import { makePinoLoggerMock } from '@acme-libs/testing';

import {
  ProductAlreadyArchivedException,
  ProductNameInvalidException,
  ProductNotFoundException,
  ProductSkuInvalidException,
  ProductSkuTakenException,
  ProductTagNotFoundException,
  ProductVersionConflictException,
  ProductVersionInvalidException,
  ProductVersionMismatchException,
} from '../../../domain';
import { ProductHttpExceptionFilter } from '../product-http-exception.filter';

describe('ProductHttpExceptionFilter', () => {
  let baseCatch: jest.SpyInstance<void, [HttpException, ArgumentsHost]>;
  let filter: ProductHttpExceptionFilter;

  beforeEach(() => {
    baseCatch = jest
      .spyOn(HttpExceptionFilter.prototype, 'catch')
      .mockImplementation(() => undefined) as unknown as jest.SpyInstance<
      void,
      [HttpException, ArgumentsHost]
    >;
    filter = new ProductHttpExceptionFilter(
      {} as ConstructorParameters<typeof ProductHttpExceptionFilter>[0],
      makePinoLoggerMock(),
    );
  });

  it('hands the HttpException over together with the same host', () => {
    const host = {} as ArgumentsHost;

    filter.catch(new ProductNotFoundException('100'), host);

    expect(baseCatch).toHaveBeenCalledTimes(1);
    expect(baseCatch).toHaveBeenCalledWith(expect.any(HttpException), host);
  });

  it.each([
    [
      'PRODUCT_SKU_INVALID',
      400,
      new ProductSkuInvalidException(/^[A-Z]+$/, 'SKU-0001', 'domain message'),
    ],
    ['PRODUCT_NAME_INVALID', 400, new ProductNameInvalidException(255, 'domain message')],
    ['PRODUCT_NOT_FOUND', 404, new ProductNotFoundException('100', 'domain message')],
    ['PRODUCT_ALREADY_ARCHIVED', 409, new ProductAlreadyArchivedException('100', 'domain message')],
    ['PRODUCT_SKU_TAKEN', 409, new ProductSkuTakenException('SKU-0001', 'domain message')],
    ['VERSION_CONFLICT', 409, new ProductVersionConflictException('100', 5, 4, 'domain message')],
    ['VERSION_MISMATCH', 412, new ProductVersionMismatchException('100', 3, 4, 'domain message')],
    ['PRODUCT_TAG_NOT_FOUND', 422, new ProductTagNotFoundException(['999'], 'domain message')],
    ['PRODUCT_VERSION_INVALID', 500, new ProductVersionInvalidException(0, 'domain message')],
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
      new ProductVersionMismatchException('100', 3, 4, 'domain message'),
      {} as ArgumentsHost,
    );

    const [error] = baseCatch.mock.calls[0];

    expect(error.getResponse()).toEqual({
      statusCode: 412,
      message: 'domain message',
      code: 'VERSION_MISMATCH',
      details: { currentVersion: 4 },
    });
  });

  it('adds the missing tags to the body', () => {
    filter.catch(new ProductTagNotFoundException(['998', '999']), {} as ArgumentsHost);

    const [error] = baseCatch.mock.calls[0];

    expect(error.getResponse()).toEqual({
      statusCode: 422,
      message: 'Some of the tags do not exist',
      code: 'PRODUCT_TAG_NOT_FOUND',
      details: { missingTagIds: ['998', '999'] },
    });
  });
});
