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
  NoteCreateUseCase,
  NoteDeleteUseCase,
  NoteGetManyUseCase,
  NoteGetOneUseCase,
  NoteGetRevisionsUseCase,
  NoteResolveUseCase,
  NoteUpdateUseCase,
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
    private readonly create: NoteCreateUseCase,
    private readonly getMany: NoteGetManyUseCase,
    private readonly getOne: NoteGetOneUseCase,
    private readonly update: NoteUpdateUseCase,
    private readonly resolve: NoteResolveUseCase,
    private readonly getRevisions: NoteGetRevisionsUseCase,
    private readonly remove: NoteDeleteUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Attach a back-office note to any subject' })
  @ApiCreatedResponse({ type: NoteResponseDto })
  @ApiErrorResponses({
    filterStatus: NoteHttpExceptionFilter.STATUS,
    codes: [NoteExceptionCodeEnum.NOTE_SUBJECT_INVALID, NoteExceptionCodeEnum.NOTE_BODY_INVALID],
  })
  public async handleCreate(
    @Body() request: NoteCreateRequestDto,
    @CurrentUser() user: IAuthCurrentUserView,
  ): Promise<NoteResponseDto> {
    const { subjectType, subjectId, body } = request;
    const { id: authorId } = user;

    return await this.create.execute({ subjectType, subjectId, body, authorId });
  }

  @Get()
  @ApiOperation({ summary: 'Browse your notes, newest first, optionally of one subject' })
  @ApiOkResponse({ type: NotePageResponseDto })
  @ApiErrorResponses({
    filterStatus: NoteHttpExceptionFilter.STATUS,
    codes: [NoteExceptionCodeEnum.NOTE_SUBJECT_INVALID],
  })
  public async handleGetMany(
    @Query() query: NoteGetManyQueryDto,
    @CurrentUser() user: IAuthCurrentUserView,
  ): Promise<NotePageResponseDto> {
    const { page, limit, subjectType, subjectId, resolved } = query;
    const { id: authorId } = user;

    return await this.getMany.execute({ page, limit, subjectType, subjectId, resolved, authorId });
  }

  @Get(':noteId')
  @ApiOperation({ summary: 'Read one of your notes' })
  @ApiOkResponse({ type: NoteResponseDto })
  @ApiErrorResponses({
    filterStatus: NoteHttpExceptionFilter.STATUS,
    codes: [NoteExceptionCodeEnum.NOTE_NOT_FOUND],
  })
  public async handleGetOne(
    @Param() params: NoteIdParamDto,
    @CurrentUser() user: IAuthCurrentUserView,
  ): Promise<NoteResponseDto> {
    const { noteId } = params;
    const { id: authorId } = user;

    return await this.getOne.execute({ noteId, authorId });
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
  public async handleUpdate(
    @Param() params: NoteIdParamDto,
    @Body() request: NoteUpdateRequestDto,
    @CurrentUser() user: IAuthCurrentUserView,
    @IfMatch() expectedVersion: Maybe<number>,
  ): Promise<NoteResponseDto> {
    const { noteId } = params;
    const { body } = request;
    const { id: editorId } = user;

    return await this.update.execute({ noteId, body, editorId, expectedVersion });
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
  public async handleResolve(
    @Param() params: NoteIdParamDto,
    @CurrentUser() user: IAuthCurrentUserView,
    @IfMatch() expectedVersion: Maybe<number>,
  ): Promise<NoteResponseDto> {
    const { noteId } = params;
    const { id: authorId } = user;

    return await this.resolve.execute({ noteId, authorId, expectedVersion });
  }

  @Get(':noteId/revisions')
  @ApiOperation({ summary: 'Read the update history of one of your notes, newest first' })
  @ApiOkResponse({ type: NoteRevisionPageResponseDto })
  @ApiErrorResponses({
    filterStatus: NoteHttpExceptionFilter.STATUS,
    codes: [NoteExceptionCodeEnum.NOTE_NOT_FOUND],
  })
  public async handleGetRevisions(
    @Param() params: NoteIdParamDto,
    @Query() query: NoteGetRevisionsQueryDto,
    @CurrentUser() user: IAuthCurrentUserView,
  ): Promise<NoteRevisionPageResponseDto> {
    const { noteId } = params;
    const { page, limit } = query;
    const { id: authorId } = user;

    return await this.getRevisions.execute({ noteId, authorId, page, limit });
  }

  @Delete(':noteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete one of your notes' })
  @ApiNoContentResponse()
  @ApiErrorResponses({
    filterStatus: NoteHttpExceptionFilter.STATUS,
    codes: [NoteExceptionCodeEnum.NOTE_NOT_FOUND],
  })
  public async handleDelete(
    @Param() params: NoteIdParamDto,
    @CurrentUser() user: IAuthCurrentUserView,
  ): Promise<void> {
    const { noteId } = params;
    const { id: authorId } = user;

    await this.remove.execute({ noteId, authorId });
  }
}
