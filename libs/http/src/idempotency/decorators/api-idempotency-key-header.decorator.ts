import { ApiHeader } from '@nestjs/swagger';

import { IdempotencyKeyHelper } from '../helpers/idempotency-key.helper';

export const ApiIdempotencyKeyHeader = (): MethodDecorator & ClassDecorator =>
  ApiHeader({
    name: IdempotencyKeyHelper.HEADER,
    required: true,
    description: `At most ${IdempotencyKeyHelper.MAX_LENGTH} characters; a missing key answers ${IdempotencyKeyHelper.REQUIRED_CODE} (400), a longer one ${IdempotencyKeyHelper.INVALID_CODE} (400)`,
  });
