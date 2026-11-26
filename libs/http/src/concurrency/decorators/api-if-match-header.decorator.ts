import { ApiHeader } from '@nestjs/swagger';

import { IfMatchHelper } from '../helpers/if-match.helper';

export const ApiIfMatchHeader = (): MethodDecorator & ClassDecorator =>
  ApiHeader({
    name: IfMatchHelper.HEADER,
    required: false,
    description: `The version as read, for optimistic concurrency; a value other than decimal digits, bare or quoted, answers ${IfMatchHelper.INVALID_CODE} (400)`,
  });
