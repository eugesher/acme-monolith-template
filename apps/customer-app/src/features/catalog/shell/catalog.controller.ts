import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CatalogProductListCase } from '../application';
import { CatalogProductListQueryDto, CatalogProductPageResponseDto } from '../presentation';

@ApiTags('Catalog')
@Controller('products')
export class CatalogController {
  constructor(private readonly productListCase: CatalogProductListCase) {}

  @Get()
  @ApiOperation({ summary: 'List the active products, by id' })
  @ApiOkResponse({ type: CatalogProductPageResponseDto })
  public async productList(
    @Query() query: CatalogProductListQueryDto,
  ): Promise<CatalogProductPageResponseDto> {
    const { page, limit } = query;

    return await this.productListCase.execute({ page, limit });
  }
}
