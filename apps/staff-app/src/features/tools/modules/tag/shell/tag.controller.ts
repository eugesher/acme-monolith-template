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

import {
  TagCreateUseCase,
  TagDeleteUseCase,
  TagGetManyUseCase,
  TagUpdateUseCase,
} from '../application';
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
    private readonly create: TagCreateUseCase,
    private readonly getMany: TagGetManyUseCase,
    private readonly update: TagUpdateUseCase,
    private readonly remove: TagDeleteUseCase,
  ) {}

  @Post()
  @RequiresPermission(PermissionCodeEnum.TAG_WRITE)
  @ApiOperation({ summary: 'Create a tag' })
  @ApiCreatedResponse({ type: TagResponseDto })
  @ApiErrorResponses({
    filterStatus: TagHttpExceptionFilter.STATUS,
    codes: [TagExceptionCodeEnum.TAG_NAME_INVALID, TagExceptionCodeEnum.TAG_NAME_TAKEN],
  })
  public async handleCreate(@Body() body: TagCreateRequestDto): Promise<TagResponseDto> {
    const { name } = body;

    return await this.create.execute({ name });
  }

  @Get()
  @RequiresPermission(PermissionCodeEnum.TAG_READ)
  @ApiOperation({ summary: 'List the tags by name' })
  @ApiOkResponse({ type: TagPageResponseDto })
  public async handleGetMany(@Query() query: TagGetManyQueryDto): Promise<TagPageResponseDto> {
    const { page, limit } = query;

    return await this.getMany.execute({ page, limit });
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
  public async handleUpdate(
    @Param() params: TagIdParamDto,
    @Body() body: TagUpdateRequestDto,
  ): Promise<TagResponseDto> {
    const { tagId } = params;
    const { name } = body;

    return await this.update.execute({ tagId, name });
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
  public async handleDelete(@Param() params: TagIdParamDto): Promise<void> {
    const { tagId } = params;

    await this.remove.execute({ tagId });
  }
}
