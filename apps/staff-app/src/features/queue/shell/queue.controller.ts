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
  QueueDeleteFailedJobCase,
  QueueGetFailedJobsCase,
  QueueGetManyCase,
  QueueRetryFailedJobCase,
} from '../application';
import { QueueExceptionCodeEnum } from '../domain';
import {
  QueueFailedJobPageResponseDto,
  QueueGetFailedJobsQueryDto,
  QueueHttpExceptionFilter,
  QueueJobParamDto,
  QueueNameParamDto,
  QueueResponseDto,
} from '../presentation';

@ApiTags('Queues')
@UseFilters(QueueHttpExceptionFilter)
@Controller('queues')
export class QueueController {
  constructor(
    private readonly getManyCase: QueueGetManyCase,
    private readonly getFailedJobsCase: QueueGetFailedJobsCase,
    private readonly retryFailedJobCase: QueueRetryFailedJobCase,
    private readonly deleteFailedJobCase: QueueDeleteFailedJobCase,
  ) {}

  @Get()
  @RequiresPermission(PermissionCodeEnum.QUEUE_READ)
  @ApiOperation({ summary: 'List the queues with the counts of their jobs' })
  @ApiOkResponse({ type: [QueueResponseDto] })
  public async getMany(): Promise<QueueResponseDto[]> {
    return await this.getManyCase.execute();
  }

  @Get(':queueName/jobs/failed')
  @RequiresPermission(PermissionCodeEnum.QUEUE_READ)
  @ApiOperation({ summary: 'Browse the failed jobs of a queue, newest first' })
  @ApiOkResponse({ type: QueueFailedJobPageResponseDto })
  @ApiErrorResponses({
    filterStatus: QueueHttpExceptionFilter.STATUS,
    codes: [QueueExceptionCodeEnum.QUEUE_NOT_FOUND],
  })
  public async getFailedJobs(
    @Param() params: QueueNameParamDto,
    @Query() query: QueueGetFailedJobsQueryDto,
  ): Promise<QueueFailedJobPageResponseDto> {
    const { queueName } = params;
    const { page, limit } = query;

    return await this.getFailedJobsCase.execute({ queueName, page, limit });
  }

  @Post(':queueName/jobs/failed/:jobId/retry')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequiresPermission(PermissionCodeEnum.QUEUE_RETRY)
  @ApiOperation({ summary: 'Return a failed job to the queue' })
  @ApiNoContentResponse()
  @ApiErrorResponses({
    filterStatus: QueueHttpExceptionFilter.STATUS,
    codes: [
      QueueExceptionCodeEnum.QUEUE_NOT_FOUND,
      QueueExceptionCodeEnum.QUEUE_JOB_NOT_FOUND,
      QueueExceptionCodeEnum.QUEUE_JOB_NOT_FAILED,
    ],
  })
  public async retryFailedJob(
    @Param() params: QueueJobParamDto,
    @CurrentUser() user: IAuthCurrentUserView,
  ): Promise<void> {
    const { queueName, jobId } = params;
    const { id: staffUserId } = user;

    await this.retryFailedJobCase.execute({ queueName, jobId, staffUserId });
  }

  @Delete(':queueName/jobs/failed/:jobId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequiresPermission(PermissionCodeEnum.QUEUE_DELETE)
  @ApiOperation({ summary: 'Delete a failed job' })
  @ApiNoContentResponse()
  @ApiErrorResponses({
    filterStatus: QueueHttpExceptionFilter.STATUS,
    codes: [
      QueueExceptionCodeEnum.QUEUE_NOT_FOUND,
      QueueExceptionCodeEnum.QUEUE_JOB_NOT_FOUND,
      QueueExceptionCodeEnum.QUEUE_JOB_NOT_FAILED,
    ],
  })
  public async deleteFailedJob(
    @Param() params: QueueJobParamDto,
    @CurrentUser() user: IAuthCurrentUserView,
  ): Promise<void> {
    const { queueName, jobId } = params;
    const { id: staffUserId } = user;

    await this.deleteFailedJobCase.execute({ queueName, jobId, staffUserId });
  }
}
