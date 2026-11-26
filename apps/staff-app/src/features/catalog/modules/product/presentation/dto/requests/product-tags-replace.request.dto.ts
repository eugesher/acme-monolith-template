import { ArrayMaxSize, IsArray } from 'class-validator';

import { IsEntityId } from '@acme-libs/http';

export class ProductTagsReplaceRequestDto {
  @IsEntityId({
    example: ['300', '301'],
    description: 'The ids of the tags the product keeps, at most 20; an empty list clears them',
    each: true,
  })
  @IsArray()
  @ArrayMaxSize(20)
  public tagIds: string[];
}
