import { ApiResponseProperty } from '@nestjs/swagger';

import { PageResponseType } from '@acme-libs/http';

class CatalogProductPageResponseItemDto {
  @ApiResponseProperty({ example: '12' })
  public id: string;

  @ApiResponseProperty({ example: 'SKU-0001' })
  public sku: string;

  @ApiResponseProperty({ example: 'Reference product' })
  public name: string;
}

export class CatalogProductPageResponseDto extends PageResponseType(
  CatalogProductPageResponseItemDto,
) {}
