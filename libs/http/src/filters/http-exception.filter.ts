import {
  Catch,
  ConflictException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { MysqlErrorHelper } from '@acme-libs/toolkit';

import { RequestBodyHelper } from './request-body.helper';
import type { ErrorResponseDto } from '../errors/error.response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private static readonly SERVER_ERROR_STATUS = 500;
  private static readonly DUPLICATE_KEY_MESSAGE = 'Resource already exists';
  private static readonly UNKNOWN_STATUS_CODE = 'HTTP_ERROR';

  constructor(
    private readonly adapterHost: HttpAdapterHost,
    @InjectPinoLogger(HttpExceptionFilter.name)
    private readonly logger: PinoLogger,
  ) {}

  public catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.adapterHost;
    const http = host.switchToHttp();
    const request = http.getRequest<{ body?: unknown }>();
    const answered = HttpExceptionFilter.toHttpException(exception);
    const status = answered.getStatus();
    const body = HttpExceptionFilter.toBody(answered);
    const cause = answered === exception ? {} : { err: exception };
    const details = {
      method: httpAdapter.getRequestMethod(request) as string,
      url: httpAdapter.getRequestUrl(request) as string,
      status,
      request: RequestBodyHelper.mask(request.body),
      response: body,
      ...cause,
    };

    if (status >= HttpExceptionFilter.SERVER_ERROR_STATUS) {
      this.logger.error(details, 'Response with error');
    } else {
      this.logger.warn(details, 'Response with error');
    }

    httpAdapter.reply(http.getResponse(), body, status);
  }

  private static toHttpException(exception: unknown): HttpException {
    if (exception instanceof HttpException) {
      return exception;
    }

    if (MysqlErrorHelper.isDuplicateKey(exception)) {
      return new ConflictException(HttpExceptionFilter.DUPLICATE_KEY_MESSAGE);
    }

    return new InternalServerErrorException();
  }

  private static toBody(answered: HttpException): ErrorResponseDto {
    const statusCode = answered.getStatus();
    const response = answered.getResponse();
    const fields: { code?: unknown; details?: unknown } =
      typeof response === 'string' ? {} : response;
    const code =
      typeof fields.code === 'string' ? fields.code : HttpExceptionFilter.codeOf(statusCode);
    const details = HttpExceptionFilter.isRecord(fields.details) ? fields.details : null;

    return { statusCode, code, message: answered.message, details };
  }

  private static codeOf(statusCode: number): string {
    return statusCode in HttpStatus
      ? HttpStatus[statusCode]
      : HttpExceptionFilter.UNKNOWN_STATUS_CODE;
  }

  private static isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
    return typeof value === 'object' && value !== null;
  }
}
