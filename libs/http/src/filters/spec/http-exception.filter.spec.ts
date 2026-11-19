import {
  BadRequestException,
  HttpException,
  NotFoundException,
  ServiceUnavailableException,
  type ArgumentsHost,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import type { HttpAdapterHost } from '@nestjs/core';
import type { PinoLogger } from 'nestjs-pino';

import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { HttpExceptionFilter } from '../http-exception.filter';

describe('HttpExceptionFilter', () => {
  let reply: jest.Mock;
  let logger: PinoLoggerMock;
  let host: ArgumentsHost;
  let filter: HttpExceptionFilter;

  beforeEach(() => {
    reply = jest.fn();
    logger = makePinoLoggerMock();
    host = {
      switchToHttp: () => ({
        getRequest: () => ({ body: { title: 'Lamp', password: 'secret' } }),
        getResponse: () => 'response',
      }),
    } as unknown as ArgumentsHost;
    filter = new HttpExceptionFilter(
      {
        httpAdapter: {
          getRequestMethod: () => 'POST',
          getRequestUrl: () => '/api/items',
          reply,
        },
      } as unknown as HttpAdapterHost,
      logger as unknown as PinoLogger,
    );
  });

  it('answers with the status, the code, the message and the details of the exception', () => {
    const exception = new HttpException(
      {
        statusCode: 409,
        code: 'VERSION_MISMATCH',
        message: 'Item 7 changed',
        details: { currentVersion: 4 },
      },
      409,
    );

    filter.catch(exception, host);

    expect(reply).toHaveBeenCalledWith(
      'response',
      {
        statusCode: 409,
        code: 'VERSION_MISMATCH',
        message: 'Item 7 changed',
        details: { currentVersion: 4 },
      },
      409,
    );
  });

  it('answers the details of an exception without them with null', () => {
    const exception = new HttpException(
      { statusCode: 404, code: 'ITEM_NOT_FOUND', message: 'Item 7 was not found', details: null },
      404,
    );

    filter.catch(exception, host);

    expect(reply).toHaveBeenCalledWith(
      'response',
      { statusCode: 404, code: 'ITEM_NOT_FOUND', message: 'Item 7 was not found', details: null },
      404,
    );
  });

  it('names an exception without a code after its status', () => {
    filter.catch(new NotFoundException('Cannot GET /api/lamps'), host);

    expect(reply).toHaveBeenCalledWith(
      'response',
      { statusCode: 404, code: 'NOT_FOUND', message: 'Cannot GET /api/lamps', details: null },
      404,
    );
  });

  it('answers an exception of a plain message with that message', () => {
    filter.catch(new HttpException('Request body is too large', 413), host);

    expect(reply).toHaveBeenCalledWith(
      'response',
      {
        statusCode: 413,
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Request body is too large',
        details: null,
      },
      413,
    );
  });

  it('answers a status without a name with HTTP_ERROR', () => {
    filter.catch(new HttpException('Client closed the request', 499), host);

    expect(reply).toHaveBeenCalledWith(
      'response',
      {
        statusCode: 499,
        code: 'HTTP_ERROR',
        message: 'Client closed the request',
        details: null,
      },
      499,
    );
  });

  it('logs a client error as a warning with the masked request body and the response', () => {
    const exception = new BadRequestException({
      statusCode: 400,
      code: 'VALIDATION_FAILED',
      message: 'The request is not valid',
      details: { fields: [{ field: 'title', messages: ['title must be a string'] }] },
    });

    filter.catch(exception, host);

    expect(logger.warn).toHaveBeenCalledWith(
      {
        method: 'POST',
        url: '/api/items',
        status: 400,
        request: { title: 'Lamp', password: '[REDACTED]' },
        response: {
          statusCode: 400,
          code: 'VALIDATION_FAILED',
          message: 'The request is not valid',
          details: { fields: [{ field: 'title', messages: ['title must be a string'] }] },
        },
      },
      'Response with error',
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('logs a server error as an error', () => {
    filter.catch(new ServiceUnavailableException(), host);

    expect(logger.error).toHaveBeenCalledWith(
      {
        method: 'POST',
        url: '/api/items',
        status: 503,
        request: { title: 'Lamp', password: '[REDACTED]' },
        response: {
          statusCode: 503,
          code: 'SERVICE_UNAVAILABLE',
          message: 'Service Unavailable',
          details: null,
        },
      },
      'Response with error',
    );
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('answers a duplicate key with 409 and logs it as a warning with the query failure', () => {
    const driverError = Object.assign(new Error('Duplicate entry'), { errno: 1062 });
    const exception = new QueryFailedError('INSERT', [], driverError);

    filter.catch(exception, host);

    expect(reply).toHaveBeenCalledWith(
      'response',
      { statusCode: 409, code: 'CONFLICT', message: 'Resource already exists', details: null },
      409,
    );
    expect(logger.warn).toHaveBeenCalledWith(
      {
        method: 'POST',
        url: '/api/items',
        status: 409,
        request: { title: 'Lamp', password: '[REDACTED]' },
        response: {
          statusCode: 409,
          code: 'CONFLICT',
          message: 'Resource already exists',
          details: null,
        },
        err: exception,
      },
      'Response with error',
    );
  });

  it('answers another query failure with 500 and logs it as an error with the failure', () => {
    const driverError = Object.assign(new Error('Deadlock'), { errno: 1213 });
    const exception = new QueryFailedError('UPDATE', [], driverError);

    filter.catch(exception, host);

    expect(reply).toHaveBeenCalledWith(
      'response',
      {
        statusCode: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error',
        details: null,
      },
      500,
    );
    expect(logger.error).toHaveBeenCalledWith(
      {
        method: 'POST',
        url: '/api/items',
        status: 500,
        request: { title: 'Lamp', password: '[REDACTED]' },
        response: {
          statusCode: 500,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal Server Error',
          details: null,
        },
        err: exception,
      },
      'Response with error',
    );
  });

  it('answers an unknown error with 500 without its message', () => {
    const exception = new Error('connect ECONNREFUSED 10.0.0.7:3306');

    filter.catch(exception, host);

    expect(reply).toHaveBeenCalledWith(
      'response',
      {
        statusCode: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error',
        details: null,
      },
      500,
    );
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500, err: exception }),
      'Response with error',
    );
  });
});
