import type { HttpStatus } from '@nestjs/common';

export interface IApiErrorResponsesOptions<TCode extends string> {
  statuses: Readonly<Record<TCode, HttpStatus>>;
  codes: readonly TCode[];
}
