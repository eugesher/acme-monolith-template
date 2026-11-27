import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { RequiresPermission } from '@acme-libs/auth';
import { ApiErrorResponses } from '@acme-libs/http';
import { PermissionCodeEnum } from '@acme-libs/kernel';

import { TagCreateCase, TagDeleteCase, TagGetManyCase, TagUpdateCase } from '../application';
import { TagExceptionCodeEnum } from '../domain';
import {
  TagCreateRequestDto,
  TagGetManyQueryDto,
  TagHttpExceptionFilter,
  TagIdParamDto,
  TagPageResponseDto,
  TagResponseDto,
  TagUpdateRequestDto,
} from '../presentation';

@ApiTags('Tools/Tag')
@UseFilters(TagHttpExceptionFilter)
@Controller('tools/tags')
export class TagController {
  constructor(
    private readonly createCase: TagCreateCase,
    private readonly getManyCase: TagGetManyCase,
    private readonly updateCase: TagUpdateCase,
    private readonly deleteCase: TagDeleteCase,
  ) {}

  @Post()
  @RequiresPermission(PermissionCodeEnum.TAG_WRITE)
  @ApiOperation({ summary: 'Create a tag' })
  @ApiCreatedResponse({ type: TagResponseDto })
  @ApiErrorResponses({
    filterStatus: TagHttpExceptionFilter.STATUS,
    codes: [TagExceptionCodeEnum.TAG_NAME_INVALID, TagExceptionCodeEnum.TAG_NAME_TAKEN],
  })
  public async create(@Body() body: TagCreateRequestDto): Promise<TagResponseDto> {
    const { name } = body;

    return await this.createCase.execute({ name });
  }

  @Get()
  @RequiresPermission(PermissionCodeEnum.TAG_READ)
  @ApiOperation({ summary: 'List the tags by name' })
  @ApiOkResponse({ type: TagPageResponseDto })
  public async getMany(@Query() query: TagGetManyQueryDto): Promise<TagPageResponseDto> {
    const { page, limit } = query;

    return await this.getManyCase.execute({ page, limit });
  }

  @Patch(':tagId')
  @RequiresPermission(PermissionCodeEnum.TAG_WRITE)
  @ApiOperation({ summary: 'Update a tag' })
  @ApiOkResponse({ type: TagResponseDto })
  @ApiErrorResponses({
    filterStatus: TagHttpExceptionFilter.STATUS,
    codes: [
      TagExceptionCodeEnum.TAG_NAME_INVALID,
      TagExceptionCodeEnum.TAG_NOT_FOUND,
      TagExceptionCodeEnum.TAG_NAME_TAKEN,
    ],
  })
  public async update(
    @Param() params: TagIdParamDto,
    @Body() body: TagUpdateRequestDto,
  ): Promise<TagResponseDto> {
    const { tagId } = params;
    const { name } = body;

    return await this.updateCase.execute({ tagId, name });
  }

  @Delete(':tagId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequiresPermission(PermissionCodeEnum.TAG_WRITE)
  @ApiOperation({ summary: 'Delete a tag and unlink it from every subject' })
  @ApiNoContentResponse()
  @ApiErrorResponses({
    filterStatus: TagHttpExceptionFilter.STATUS,
    codes: [TagExceptionCodeEnum.TAG_NOT_FOUND],
  })
  public async delete(@Param() params: TagIdParamDto): Promise<void> {
    const { tagId } = params;

    await this.deleteCase.execute({ tagId });
  }
}
