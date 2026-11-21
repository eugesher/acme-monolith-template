import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { StrictValidationPipe } from '../../validation/strict-validation.pipe';
import { ErrorResponseDto } from '../error.response.dto';
import type { IApiErrorResponsesOptions } from './api-error-responses.options';

export const ApiErrorResponses = <TCode extends string>(
  options: IApiErrorResponsesOptions<TCode>,
): MethodDecorator & ClassDecorator => {
  const { statuses, codes } = options;
  const answeredStatuses = codes.map((code) => statuses[code]);
  const distinctStatuses = [...new Set(answeredStatuses)];

  const responses = distinctStatuses.map((status) => {
    const statusCodes = codes.filter((code) => statuses[code] === status);
    const describedCodes =
      status === HttpStatus.BAD_REQUEST ? [StrictValidationPipe.CODE, ...statusCodes] : statusCodes;
    const description = describedCodes.join(', ');

    return ApiResponse({ status, type: ErrorResponseDto, description });
  });

  return applyDecorators(...responses);
};
