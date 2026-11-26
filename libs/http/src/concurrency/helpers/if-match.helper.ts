import { BadRequestException, HttpStatus } from '@nestjs/common';

import type { Maybe } from '@acme-libs/toolkit';

export class IfMatchHelper {
  public static readonly HEADER = 'If-Match';
  public static readonly INVALID_CODE = 'IF_MATCH_INVALID';

  private static readonly QUOTED = /^"(.*)"$/;
  private static readonly DIGITS = /^\d+$/;

  public static parse(header: Maybe<string | string[]>): Maybe<number> {
    if (typeof header !== 'string') {
      return undefined;
    }

    const unquotedHeader = header.trim().replace(IfMatchHelper.QUOTED, '$1');

    if (unquotedHeader.length === 0) {
      return undefined;
    }

    const version = Number(unquotedHeader);

    if (!IfMatchHelper.DIGITS.test(unquotedHeader) || !Number.isSafeInteger(version)) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'The If-Match header must be a non-negative integer version',
        code: IfMatchHelper.INVALID_CODE,
      });
    }

    return version;
  }
}
