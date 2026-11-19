import { ArrayMaxSize, ArrayMinSize, IsArray } from 'class-validator';

import { IsEntityId } from '@acme-libs/http';

export class OrderPlaceRequestDto {
  @IsEntityId({
    example: ['100', '100', '103'],
    description: 'One product id per unit: a repeated id orders one more unit, 1-100 units',
    each: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  public productIds: string[];
}
