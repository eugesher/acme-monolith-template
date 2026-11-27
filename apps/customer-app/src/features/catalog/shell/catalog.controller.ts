import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CatalogGetProductListCase } from '../application';
import { CatalogGetProductListQueryDto, CatalogProductPageResponseDto } from '../presentation';

@ApiTags('Catalog')
@Controller('products')
export class CatalogController {
  constructor(private readonly getProductListCase: CatalogGetProductListCase) {}

  @Get()
  @ApiOperation({ summary: 'List the active products, by id' })
  @ApiOkResponse({ type: CatalogProductPageResponseDto })
  public async getProductList(
    @Query() query: CatalogGetProductListQueryDto,
  ): Promise<CatalogProductPageResponseDto> {
    const { page, limit } = query;

    return await this.getProductListCase.execute({ page, limit });
  }
}
