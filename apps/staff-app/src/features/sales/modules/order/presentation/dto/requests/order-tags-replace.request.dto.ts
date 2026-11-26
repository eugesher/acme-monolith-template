import { ArrayMaxSize, IsArray } from 'class-validator';

import { IsEntityId } from '@acme-libs/http';

export class OrderTagsReplaceRequestDto {
  @IsEntityId({
    example: ['302'],
    description: 'The ids of the tags the order keeps, at most 20; an empty list clears them',
    each: true,
  })
  @IsArray()
  @ArrayMaxSize(20)
  public tagIds: string[];
}
