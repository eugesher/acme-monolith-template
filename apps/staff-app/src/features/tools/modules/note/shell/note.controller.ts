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

import { CurrentUser } from '@acme-libs/auth';
import { ApiErrorResponses, ApiIfMatchHeader, IfMatch } from '@acme-libs/http';
import type { Maybe } from '@acme-libs/toolkit';
import type { IAuthCurrentUserView } from '@acme-libs/contracts/auth';

import {
  NoteCreateCase,
  NoteDeleteCase,
  NoteGetManyCase,
  NoteGetOneCase,
  NoteGetRevisionsCase,
  NoteResolveCase,
  NoteUpdateCase,
} from '../application';
import { NoteExceptionCodeEnum } from '../domain';
import {
  NoteCreateRequestDto,
  NoteGetManyQueryDto,
  NoteGetRevisionsQueryDto,
  NoteHttpExceptionFilter,
  NoteIdParamDto,
  NotePageResponseDto,
  NoteResponseDto,
  NoteRevisionPageResponseDto,
  NoteUpdateRequestDto,
} from '../presentation';

@ApiTags('Tools/Note')
@UseFilters(NoteHttpExceptionFilter)
@Controller('tools/notes')
export class NoteController {
  constructor(
    private readonly createCase: NoteCreateCase,
    private readonly getManyCase: NoteGetManyCase,
    private readonly getOneCase: NoteGetOneCase,
    private readonly updateCase: NoteUpdateCase,
    private readonly resolveCase: NoteResolveCase,
    private readonly getRevisionsCase: NoteGetRevisionsCase,
    private readonly deleteCase: NoteDeleteCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Attach a back-office note to any subject' })
  @ApiCreatedResponse({ type: NoteResponseDto })
  @ApiErrorResponses({
    filterStatus: NoteHttpExceptionFilter.STATUS,
    codes: [NoteExceptionCodeEnum.NOTE_SUBJECT_INVALID, NoteExceptionCodeEnum.NOTE_BODY_INVALID],
  })
  public async create(
    @Body() request: NoteCreateRequestDto,
    @CurrentUser() user: IAuthCurrentUserView,
  ): Promise<NoteResponseDto> {
    const { subjectType, subjectId, body } = request;
    const { id: authorId } = user;

    return await this.createCase.execute({ subjectType, subjectId, body, authorId });
  }

  @Get()
  @ApiOperation({ summary: 'Browse your notes, newest first, optionally of one subject' })
  @ApiOkResponse({ type: NotePageResponseDto })
  @ApiErrorResponses({
    filterStatus: NoteHttpExceptionFilter.STATUS,
    codes: [NoteExceptionCodeEnum.NOTE_SUBJECT_INVALID],
  })
  public async getMany(
    @Query() query: NoteGetManyQueryDto,
    @CurrentUser() user: IAuthCurrentUserView,
  ): Promise<NotePageResponseDto> {
    const { page, limit, subjectType, subjectId, resolved } = query;
    const { id: authorId } = user;

    return await this.getManyCase.execute({
      page,
      limit,
      subjectType,
      subjectId,
      resolved,
      authorId,
    });
  }

  @Get(':noteId')
  @ApiOperation({ summary: 'Read one of your notes' })
  @ApiOkResponse({ type: NoteResponseDto })
  @ApiErrorResponses({
    filterStatus: NoteHttpExceptionFilter.STATUS,
    codes: [NoteExceptionCodeEnum.NOTE_NOT_FOUND],
  })
  public async getOne(
    @Param() params: NoteIdParamDto,
    @CurrentUser() user: IAuthCurrentUserView,
  ): Promise<NoteResponseDto> {
    const { noteId } = params;
    const { id: authorId } = user;

    return await this.getOneCase.execute({ noteId, authorId });
  }

  @Patch(':noteId')
  @ApiIfMatchHeader()
  @ApiOperation({
    summary: 'Rewrite the body of one of your notes and record the revision with it',
  })
  @ApiOkResponse({ type: NoteResponseDto })
  @ApiErrorResponses({
    filterStatus: NoteHttpExceptionFilter.STATUS,
    codes: [
      NoteExceptionCodeEnum.NOTE_BODY_INVALID,
      NoteExceptionCodeEnum.NOTE_NOT_FOUND,
      NoteExceptionCodeEnum.NOTE_RESOLVED,
      NoteExceptionCodeEnum.NOTE_VERSION_CONFLICT,
      NoteExceptionCodeEnum.NOTE_VERSION_MISMATCH,
    ],
  })
  public async update(
    @Param() params: NoteIdParamDto,
    @Body() request: NoteUpdateRequestDto,
    @CurrentUser() user: IAuthCurrentUserView,
    @IfMatch() expectedVersion: Maybe<number>,
  ): Promise<NoteResponseDto> {
    const { noteId } = params;
    const { body } = request;
    const { id: editorId } = user;

    return await this.updateCase.execute({ noteId, body, editorId, expectedVersion });
  }

  @Post(':noteId/resolve')
  @HttpCode(HttpStatus.OK)
  @ApiIfMatchHeader()
  @ApiOperation({ summary: 'Resolve one of your notes for good; it can no longer be updated' })
  @ApiOkResponse({ type: NoteResponseDto })
  @ApiErrorResponses({
    filterStatus: NoteHttpExceptionFilter.STATUS,
    codes: [
      NoteExceptionCodeEnum.NOTE_NOT_FOUND,
      NoteExceptionCodeEnum.NOTE_RESOLVED,
      NoteExceptionCodeEnum.NOTE_VERSION_CONFLICT,
      NoteExceptionCodeEnum.NOTE_VERSION_MISMATCH,
    ],
  })
  public async resolve(
    @Param() params: NoteIdParamDto,
    @CurrentUser() user: IAuthCurrentUserView,
    @IfMatch() expectedVersion: Maybe<number>,
  ): Promise<NoteResponseDto> {
    const { noteId } = params;
    const { id: authorId } = user;

    return await this.resolveCase.execute({ noteId, authorId, expectedVersion });
  }

  @Get(':noteId/revisions')
  @ApiOperation({ summary: 'Read the update history of one of your notes, newest first' })
  @ApiOkResponse({ type: NoteRevisionPageResponseDto })
  @ApiErrorResponses({
    filterStatus: NoteHttpExceptionFilter.STATUS,
    codes: [NoteExceptionCodeEnum.NOTE_NOT_FOUND],
  })
  public async getRevisions(
    @Param() params: NoteIdParamDto,
    @Query() query: NoteGetRevisionsQueryDto,
    @CurrentUser() user: IAuthCurrentUserView,
  ): Promise<NoteRevisionPageResponseDto> {
    const { noteId } = params;
    const { page, limit } = query;
    const { id: authorId } = user;

    return await this.getRevisionsCase.execute({ noteId, authorId, page, limit });
  }

  @Delete(':noteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete one of your notes' })
  @ApiNoContentResponse()
  @ApiErrorResponses({
    filterStatus: NoteHttpExceptionFilter.STATUS,
    codes: [NoteExceptionCodeEnum.NOTE_NOT_FOUND],
  })
  public async delete(
    @Param() params: NoteIdParamDto,
    @CurrentUser() user: IAuthCurrentUserView,
  ): Promise<void> {
    const { noteId } = params;
    const { id: authorId } = user;

    await this.deleteCase.execute({ noteId, authorId });
  }
}
