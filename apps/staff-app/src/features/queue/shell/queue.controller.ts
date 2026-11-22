import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser, RequiresPermission } from '@acme-libs/auth';
import { ApiErrorResponses } from '@acme-libs/http';
import { PermissionCodeEnum } from '@acme-libs/kernel';
import type { IAuthCurrentUserView } from '@acme-libs/contracts/auth';

import {
  QueueDeleteFailedJobUseCase,
  QueueListFailedJobsUseCase,
  QueueListUseCase,
  QueueRetryFailedJobUseCase,
} from '../application';
import { QueueExceptionCodeEnum } from '../domain';
import {
  QueueFailedJobPageResponseDto,
  QueueHttpExceptionFilter,
  QueueJobParamDto,
  QueueListFailedJobsQueryDto,
  QueueNameParamDto,
  QueueResponseDto,
} from '../presentation';

@ApiTags('Queues')
@UseFilters(QueueHttpExceptionFilter)
@Controller('queues')
export class QueueController {
  constructor(
    private readonly list: QueueListUseCase,
    private readonly listFailedJobs: QueueListFailedJobsUseCase,
    private readonly retryFailedJob: QueueRetryFailedJobUseCase,
    private readonly deleteFailedJob: QueueDeleteFailedJobUseCase,
  ) {}

  @Get()
  @RequiresPermission(PermissionCodeEnum.QUEUE_READ)
  @ApiOperation({ summary: 'List the queues with the counts of their jobs' })
  @ApiOkResponse({ type: [QueueResponseDto] })
  public async handleList(): Promise<QueueResponseDto[]> {
    return await this.list.execute();
  }

  @Get(':queueName/jobs/failed')
  @RequiresPermission(PermissionCodeEnum.QUEUE_READ)
  @ApiOperation({ summary: 'Browse the failed jobs of a queue, newest first' })
  @ApiOkResponse({ type: QueueFailedJobPageResponseDto })
  @ApiErrorResponses({
    statuses: QueueHttpExceptionFilter.STATUS,
    codes: [QueueExceptionCodeEnum.QUEUE_NOT_FOUND],
  })
  public async handleListFailedJobs(
    @Param() params: QueueNameParamDto,
    @Query() query: QueueListFailedJobsQueryDto,
  ): Promise<QueueFailedJobPageResponseDto> {
    const { queueName } = params;
    const { page, limit } = query;

    return await this.listFailedJobs.execute({ queueName, page, limit });
  }

  @Post(':queueName/jobs/failed/:jobId/retry')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequiresPermission(PermissionCodeEnum.QUEUE_RETRY)
  @ApiOperation({ summary: 'Return a failed job to the queue' })
  @ApiNoContentResponse()
  @ApiErrorResponses({
    statuses: QueueHttpExceptionFilter.STATUS,
    codes: [
      QueueExceptionCodeEnum.QUEUE_NOT_FOUND,
      QueueExceptionCodeEnum.QUEUE_JOB_NOT_FOUND,
      QueueExceptionCodeEnum.QUEUE_JOB_NOT_FAILED,
    ],
  })
  public async handleRetryFailedJob(
    @Param() params: QueueJobParamDto,
    @CurrentUser() user: IAuthCurrentUserView,
  ): Promise<void> {
    const { queueName, jobId } = params;
    const { id: staffUserId } = user;

    await this.retryFailedJob.execute({ queueName, jobId, staffUserId });
  }

  @Delete(':queueName/jobs/failed/:jobId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequiresPermission(PermissionCodeEnum.QUEUE_DELETE)
  @ApiOperation({ summary: 'Delete a failed job' })
  @ApiNoContentResponse()
  @ApiErrorResponses({
    statuses: QueueHttpExceptionFilter.STATUS,
    codes: [
      QueueExceptionCodeEnum.QUEUE_NOT_FOUND,
      QueueExceptionCodeEnum.QUEUE_JOB_NOT_FOUND,
      QueueExceptionCodeEnum.QUEUE_JOB_NOT_FAILED,
    ],
  })
  public async handleDeleteFailedJob(
    @Param() params: QueueJobParamDto,
    @CurrentUser() user: IAuthCurrentUserView,
  ): Promise<void> {
    const { queueName, jobId } = params;
    const { id: staffUserId } = user;

    await this.deleteFailedJob.execute({ queueName, jobId, staffUserId });
  }
}
