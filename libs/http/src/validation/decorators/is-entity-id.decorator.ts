import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';

import type { IEntityIdOptions } from './entity-id.options';

export const IsEntityId = (options: IEntityIdOptions): PropertyDecorator => {
  const {
    example,
    description = 'A positive integer of up to 20 digits',
    each = false,
    optional = false,
  } = options;
  const pattern = /^[1-9]\d{0,19}$/;
  const message = each
    ? 'each value in $property must be a positive integer'
    : '$property must be a positive integer';
  const property = { example, description, type: String, isArray: each, pattern: pattern.source };
  const validation = Matches(pattern, { each, message });

  if (optional) {
    return applyDecorators(ApiPropertyOptional(property), IsOptional(), validation);
  }

  return applyDecorators(ApiProperty(property), validation);
};
