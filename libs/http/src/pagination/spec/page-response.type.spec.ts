import { ApiResponseProperty } from '@nestjs/swagger';

import { PageResponseType } from '../page-response.type';

describe('PageResponseType', () => {
  it('documents the window of the page and the items of the given class', () => {
    class ItemResponseDto {
      @ApiResponseProperty({ example: '7' })
      public id: string;
    }

    class ItemPageResponseDto extends PageResponseType(ItemResponseDto) {}

    const properties: unknown = Reflect.getMetadata(
      'swagger/apiModelPropertiesArray',
      ItemPageResponseDto.prototype,
    );
    const data: unknown = Reflect.getMetadata(
      'swagger/apiModelProperties',
      ItemPageResponseDto.prototype,
      'data',
    );

    expect(properties).toEqual([':page', ':count', ':pageCount', ':total', ':data']);
    expect(data).toMatchObject({ type: ItemResponseDto, isArray: true, readOnly: true });
  });
});
