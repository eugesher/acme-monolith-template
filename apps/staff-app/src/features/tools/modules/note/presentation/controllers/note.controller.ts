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
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '@acme-libs/auth';
import { ApiErrorResponses } from '@acme-libs/http';
import { IfMatch } from '@acme-staff/common/shared';
import type { Maybe } from '@acme-libs/toolkit';
import type { IAuthCurrentUserView } from '@acme-libs/contracts/auth';

import {
  NoteCreateUseCase,
  NoteDeleteUseCase,
  NoteEditUseCase,
  NoteGetManyUseCase,
  NoteGetOneUseCase,
  NoteGetRevisionsUseCase,
  NoteResolveUseCase,
} from '../../application';
import { NoteExceptionCodeEnum } from '../../domain';
import {
  NoteCreateRequestDto,
  NoteEditRequestDto,
  NoteGetManyQueryDto,
  NoteGetRevisionsQueryDto,
  NoteIdParamDto,
  NotePageResponseDto,
  NoteResponseDto,
  NoteRevisionPageResponseDto,
} from '../dto';
import { NoteHttpExceptionFilter } from '../filters/note-http-exception.filter';

@ApiTags('Tools/Note')
@UseFilters(NoteHttpExceptionFilter)
@Controller('tools/notes')
export class NoteController {
  constructor(
    private readonly create: NoteCreateUseCase,
    private readonly getMany: NoteGetManyUseCase,
    private readonly getOne: NoteGetOneUseCase,
    private readonly edit: NoteEditUseCase,
    private readonly resolve: NoteResolveUseCase,
    private readonly getRevisions: NoteGetRevisionsUseCase,
    private readonly remove: NoteDeleteUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Attach a back-office note to any subject' })
  @ApiCreatedResponse({ type: NoteResponseDto })
  @ApiErrorResponses(
    NoteHttpExceptionFilter.STATUS,
    NoteExceptionCodeEnum.NOTE_SUBJECT_INVALID,
    NoteExceptionCodeEnum.NOTE_BODY_INVALID,
  )
  public async handleCreate(
    @Body() request: NoteCreateRequestDto,
    @CurrentUser() user: IAuthCurrentUserView,
  ): Promise<NoteResponseDto> {
    const { subjectType, subjectId, body } = request;

    return await this.create.execute({ subjectType, subjectId, body, authorId: user.id });
  }

  @Get()
  @ApiOperation({ summary: 'Browse your notes, newest first, optionally of one subject' })
  @ApiOkResponse({ type: NotePageResponseDto })
  @ApiErrorResponses(NoteHttpExceptionFilter.STATUS, NoteExceptionCodeEnum.NOTE_SUBJECT_INVALID)
  public async handleGetMany(
    @Query() query: NoteGetManyQueryDto,
    @CurrentUser() user: IAuthCurrentUserView,
  ): Promise<NotePageResponseDto> {
    const { page, limit, subjectType, subjectId, resolved } = query;

    return await this.getMany.execute({
      page,
      limit,
      subjectType,
      subjectId,
      resolved,
      authorId: user.id,
    });
  }

  @Get(':noteId')
  @ApiOperation({ summary: 'Read one of your notes' })
  @ApiOkResponse({ type: NoteResponseDto })
  @ApiErrorResponses(NoteHttpExceptionFilter.STATUS, NoteExceptionCodeEnum.NOTE_NOT_FOUND)
  public async handleGetOne(
    @Param() params: NoteIdParamDto,
    @CurrentUser() user: IAuthCurrentUserView,
  ): Promise<NoteResponseDto> {
    const { noteId } = params;

    return await this.getOne.execute({ noteId, authorId: user.id });
  }

  @Patch(':noteId')
  @ApiHeader({ name: 'If-Match', required: false, description: 'The note version, for OCC' })
  @ApiOperation({
    summary: 'Rewrite the body of one of your notes and record the revision with it',
  })
  @ApiOkResponse({ type: NoteResponseDto })
  @ApiErrorResponses(
    NoteHttpExceptionFilter.STATUS,
    NoteExceptionCodeEnum.NOTE_BODY_INVALID,
    NoteExceptionCodeEnum.NOTE_NOT_FOUND,
    NoteExceptionCodeEnum.NOTE_RESOLVED,
    NoteExceptionCodeEnum.NOTE_VERSION_CONFLICT,
    NoteExceptionCodeEnum.NOTE_VERSION_MISMATCH,
  )
  public async handleEdit(
    @Param() params: NoteIdParamDto,
    @Body() request: NoteEditRequestDto,
    @CurrentUser() user: IAuthCurrentUserView,
    @IfMatch() expectedVersion: Maybe<number>,
  ): Promise<NoteResponseDto> {
    const { noteId } = params;
    const { body } = request;

    return await this.edit.execute({ noteId, body, editorId: user.id, expectedVersion });
  }

  @Patch(':noteId/resolve')
  @ApiHeader({ name: 'If-Match', required: false, description: 'The note version, for OCC' })
  @ApiOperation({ summary: 'Resolve one of your notes for good; it can no longer be edited' })
  @ApiOkResponse({ type: NoteResponseDto })
  @ApiErrorResponses(
    NoteHttpExceptionFilter.STATUS,
    NoteExceptionCodeEnum.NOTE_NOT_FOUND,
    NoteExceptionCodeEnum.NOTE_RESOLVED,
    NoteExceptionCodeEnum.NOTE_VERSION_CONFLICT,
    NoteExceptionCodeEnum.NOTE_VERSION_MISMATCH,
  )
  public async handleResolve(
    @Param() params: NoteIdParamDto,
    @CurrentUser() user: IAuthCurrentUserView,
    @IfMatch() expectedVersion: Maybe<number>,
  ): Promise<NoteResponseDto> {
    const { noteId } = params;

    return await this.resolve.execute({ noteId, authorId: user.id, expectedVersion });
  }

  @Get(':noteId/revisions')
  @ApiOperation({ summary: 'Read the edit history of one of your notes, newest first' })
  @ApiOkResponse({ type: NoteRevisionPageResponseDto })
  @ApiErrorResponses(NoteHttpExceptionFilter.STATUS, NoteExceptionCodeEnum.NOTE_NOT_FOUND)
  public async handleGetRevisions(
    @Param() params: NoteIdParamDto,
    @Query() query: NoteGetRevisionsQueryDto,
    @CurrentUser() user: IAuthCurrentUserView,
  ): Promise<NoteRevisionPageResponseDto> {
    const { noteId } = params;
    const { page, limit } = query;

    return await this.getRevisions.execute({ noteId, authorId: user.id, page, limit });
  }

  @Delete(':noteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete one of your notes' })
  @ApiNoContentResponse()
  @ApiErrorResponses(NoteHttpExceptionFilter.STATUS, NoteExceptionCodeEnum.NOTE_NOT_FOUND)
  public async handleDelete(
    @Param() params: NoteIdParamDto,
    @CurrentUser() user: IAuthCurrentUserView,
  ): Promise<void> {
    const { noteId } = params;

    await this.remove.execute({ noteId, authorId: user.id });
  }
}
