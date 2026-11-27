import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequiresPermission } from '@acme-libs/auth';
import { ApiErrorResponses, ApiIfMatchHeader, IfMatch } from '@acme-libs/http';
import { PermissionCodeEnum } from '@acme-libs/kernel';
import type { Maybe } from '@acme-libs/toolkit';

import {
  ProductArchiveCase,
  ProductCreateCase,
  ProductGetManyCase,
  ProductGetOneCase,
  ProductGetTagsCase,
  ProductPublishCase,
  ProductReplaceTagsCase,
  ProductUpdateCase,
} from '../application';
import { ProductExceptionCodeEnum } from '../domain';
import {
  ProductCreateRequestDto,
  ProductGetManyQueryDto,
  ProductHttpExceptionFilter,
  ProductIdParamDto,
  ProductPageResponseDto,
  ProductResponseDto,
  ProductTagsReplaceRequestDto,
  ProductTagsResponseDto,
  ProductUpdateRequestDto,
} from '../presentation';

@ApiTags('Catalog/Product')
@UseFilters(ProductHttpExceptionFilter)
@Controller('catalog/products')
export class ProductController {
  constructor(
    private readonly createCase: ProductCreateCase,
    private readonly getManyCase: ProductGetManyCase,
    private readonly getOneCase: ProductGetOneCase,
    private readonly updateCase: ProductUpdateCase,
    private readonly publishCase: ProductPublishCase,
    private readonly archiveCase: ProductArchiveCase,
    private readonly getTagsCase: ProductGetTagsCase,
    private readonly replaceTagsCase: ProductReplaceTagsCase,
  ) {}

  @Post()
  @RequiresPermission(PermissionCodeEnum.PRODUCT_WRITE)
  @ApiOperation({ summary: 'Create a product' })
  @ApiCreatedResponse({ type: ProductResponseDto })
  @ApiErrorResponses({
    filterStatus: ProductHttpExceptionFilter.STATUS,
    codes: [
      ProductExceptionCodeEnum.PRODUCT_SKU_INVALID,
      ProductExceptionCodeEnum.PRODUCT_NAME_INVALID,
      ProductExceptionCodeEnum.PRODUCT_SKU_TAKEN,
    ],
  })
  public async create(@Body() body: ProductCreateRequestDto): Promise<ProductResponseDto> {
    const { sku, name } = body;

    return await this.createCase.execute({ sku, name });
  }

  @Get()
  @RequiresPermission(PermissionCodeEnum.PRODUCT_READ)
  @ApiOperation({ summary: 'List the catalog products, newest first, optionally by tag' })
  @ApiOkResponse({ type: ProductPageResponseDto })
  public async getMany(@Query() query: ProductGetManyQueryDto): Promise<ProductPageResponseDto> {
    const { page, limit, tagId } = query;

    return await this.getManyCase.execute({ page, limit, tagId });
  }

  @Get(':productId')
  @RequiresPermission(PermissionCodeEnum.PRODUCT_READ)
  @ApiOperation({ summary: 'Read one catalog product' })
  @ApiOkResponse({ type: ProductResponseDto })
  @ApiErrorResponses({
    filterStatus: ProductHttpExceptionFilter.STATUS,
    codes: [ProductExceptionCodeEnum.PRODUCT_NOT_FOUND],
  })
  public async getOne(@Param() params: ProductIdParamDto): Promise<ProductResponseDto> {
    const { productId } = params;

    return await this.getOneCase.execute({ productId });
  }

  @Patch(':productId')
  @RequiresPermission(PermissionCodeEnum.PRODUCT_WRITE)
  @ApiIfMatchHeader()
  @ApiOperation({ summary: 'Update the fields of a product (optimistic concurrency)' })
  @ApiOkResponse({ type: ProductResponseDto })
  @ApiErrorResponses({
    filterStatus: ProductHttpExceptionFilter.STATUS,
    codes: [
      ProductExceptionCodeEnum.PRODUCT_NAME_INVALID,
      ProductExceptionCodeEnum.PRODUCT_NOT_FOUND,
      ProductExceptionCodeEnum.PRODUCT_VERSION_CONFLICT,
      ProductExceptionCodeEnum.PRODUCT_VERSION_MISMATCH,
    ],
  })
  public async update(
    @Param() params: ProductIdParamDto,
    @Body() body: ProductUpdateRequestDto,
    @IfMatch() expectedVersion: Maybe<number>,
  ): Promise<ProductResponseDto> {
    const { productId } = params;
    const { name } = body;

    return await this.updateCase.execute({ productId, name, expectedVersion });
  }

  @Post(':productId/publish')
  @HttpCode(HttpStatus.OK)
  @RequiresPermission(PermissionCodeEnum.PRODUCT_WRITE)
  @ApiIfMatchHeader()
  @ApiOperation({
    summary: 'Publish a draft product to the customer catalog (optimistic concurrency)',
  })
  @ApiOkResponse({ type: ProductResponseDto })
  @ApiErrorResponses({
    filterStatus: ProductHttpExceptionFilter.STATUS,
    codes: [
      ProductExceptionCodeEnum.PRODUCT_NOT_FOUND,
      ProductExceptionCodeEnum.PRODUCT_VERSION_CONFLICT,
      ProductExceptionCodeEnum.PRODUCT_VERSION_MISMATCH,
    ],
  })
  public async publish(
    @Param() params: ProductIdParamDto,
    @IfMatch() expectedVersion: Maybe<number>,
  ): Promise<ProductResponseDto> {
    const { productId } = params;

    return await this.publishCase.execute({ productId, expectedVersion });
  }

  @Post(':productId/archive')
  @HttpCode(HttpStatus.OK)
  @RequiresPermission(PermissionCodeEnum.PRODUCT_ARCHIVE)
  @ApiIfMatchHeader()
  @ApiOperation({ summary: 'Archive a product (optimistic concurrency)' })
  @ApiOkResponse({ type: ProductResponseDto })
  @ApiErrorResponses({
    filterStatus: ProductHttpExceptionFilter.STATUS,
    codes: [
      ProductExceptionCodeEnum.PRODUCT_NOT_FOUND,
      ProductExceptionCodeEnum.PRODUCT_ALREADY_ARCHIVED,
      ProductExceptionCodeEnum.PRODUCT_VERSION_MISMATCH,
    ],
  })
  public async archive(
    @Param() params: ProductIdParamDto,
    @IfMatch() expectedVersion: Maybe<number>,
  ): Promise<ProductResponseDto> {
    const { productId } = params;

    return await this.archiveCase.execute({ productId, expectedVersion });
  }

  @Get(':productId/tags')
  @RequiresPermission(PermissionCodeEnum.PRODUCT_READ)
  @ApiOperation({ summary: 'Read the tags of a product, by name' })
  @ApiOkResponse({ type: ProductTagsResponseDto })
  @ApiErrorResponses({
    filterStatus: ProductHttpExceptionFilter.STATUS,
    codes: [ProductExceptionCodeEnum.PRODUCT_NOT_FOUND],
  })
  public async getTags(@Param() params: ProductIdParamDto): Promise<ProductTagsResponseDto> {
    const { productId } = params;

    return await this.getTagsCase.execute({ productId });
  }

  @Put(':productId/tags')
  @RequiresPermission(PermissionCodeEnum.PRODUCT_WRITE)
  @ApiOperation({ summary: 'Replace the tags of a product' })
  @ApiOkResponse({ type: ProductTagsResponseDto })
  @ApiErrorResponses({
    filterStatus: ProductHttpExceptionFilter.STATUS,
    codes: [
      ProductExceptionCodeEnum.PRODUCT_NOT_FOUND,
      ProductExceptionCodeEnum.PRODUCT_TAG_NOT_FOUND,
    ],
  })
  public async replaceTags(
    @Param() params: ProductIdParamDto,
    @Body() body: ProductTagsReplaceRequestDto,
  ): Promise<ProductTagsResponseDto> {
    const { productId } = params;
    const { tagIds } = body;

    return await this.replaceTagsCase.execute({ productId, tagIds });
  }
}
