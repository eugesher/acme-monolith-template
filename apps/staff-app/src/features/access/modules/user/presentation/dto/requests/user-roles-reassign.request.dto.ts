import { IsArray } from 'class-validator';

import { IsEntityId } from '@acme-libs/http';

export class UserRolesReassignRequestDto {
  @IsEntityId({
    example: ['2', '3'],
    description: 'The ids of the roles the user keeps; an empty list clears them',
    each: true,
  })
  @IsArray()
  public roleIds: string[];
}
