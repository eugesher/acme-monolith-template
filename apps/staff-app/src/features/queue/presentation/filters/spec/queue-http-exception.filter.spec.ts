import { HttpException, type ArgumentsHost } from '@nestjs/common';

import { HttpExceptionFilter } from '@acme-libs/http';
import { makePinoLoggerMock } from '@acme-libs/testing';

import {
  QueueJobNotFailedException,
  QueueJobNotFoundException,
  QueueNotFoundException,
} from '../../../domain';
import { QueueHttpExceptionFilter } from '../queue-http-exception.filter';

describe('QueueHttpExceptionFilter', () => {
  let baseCatch: jest.SpyInstance<void, [HttpException, ArgumentsHost]>;
  let filter: QueueHttpExceptionFilter;

  beforeEach(() => {
    baseCatch = jest
      .spyOn(HttpExceptionFilter.prototype, 'catch')
      .mockImplementation(() => undefined) as unknown as jest.SpyInstance<
      void,
      [HttpException, ArgumentsHost]
    >;
    filter = new QueueHttpExceptionFilter(
      {} as ConstructorParameters<typeof QueueHttpExceptionFilter>[0],
      makePinoLoggerMock(),
    );
  });

  it('hands the HttpException over together with the same host', () => {
    const host = {} as ArgumentsHost;

    filter.catch(new QueueNotFoundException('unknown'), host);

    expect(baseCatch).toHaveBeenCalledTimes(1);
    expect(baseCatch).toHaveBeenCalledWith(expect.any(HttpException), host);
  });

  it.each([
    ['QUEUE_NOT_FOUND', 404, new QueueNotFoundException('unknown', 'domain message')],
    [
      'QUEUE_JOB_NOT_FOUND',
      404,
      new QueueJobNotFoundException('ledger-append', '7', 'domain message'),
    ],
    [
      'QUEUE_JOB_NOT_FAILED',
      409,
      new QueueJobNotFailedException('ledger-append', '7', 'waiting', 'domain message'),
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
