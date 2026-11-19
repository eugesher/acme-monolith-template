import { ApiHeader } from '@nestjs/swagger';

import { IfMatchHelper } from '../helpers/if-match.helper';

export const ApiIfMatchHeader = (): MethodDecorator & ClassDecorator =>
  ApiHeader({
    name: 'If-Match',
    required: false,
    description: `The version as read, for optimistic concurrency; a value that is not a non-negative integer answers ${IfMatchHelper.INVALID_CODE} (400)`,
  });
