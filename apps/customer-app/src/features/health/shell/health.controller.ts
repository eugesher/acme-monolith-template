import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Public } from '@acme-libs/auth';
import { HealthReadinessStatusEnum } from '@acme-libs/kernel';

import { HealthLivenessCase, HealthReadinessCase } from '../application';
import { HealthLivenessResponseDto, HealthReadinessResponseDto } from '../presentation';

@ApiTags('Health')
@Public()
@Controller('health')
export class HealthController {
  constructor(
    private readonly livenessCase: HealthLivenessCase,
    private readonly readinessCase: HealthReadinessCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Liveness: is the process running?' })
  @ApiOkResponse({ type: HealthLivenessResponseDto })
  public liveness(): HealthLivenessResponseDto {
    return this.livenessCase.execute();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness: can the process serve traffic right now?' })
  @ApiOkResponse({ type: HealthReadinessResponseDto })
  @ApiServiceUnavailableResponse({ type: HealthReadinessResponseDto })
  public async readiness(
    @Res({ passthrough: true }) response: { status(code: HttpStatus): unknown },
  ): Promise<HealthReadinessResponseDto> {
    const readinessView = await this.readinessCase.execute();
    const status =
      readinessView.status === HealthReadinessStatusEnum.READY
        ? HttpStatus.OK
        : HttpStatus.SERVICE_UNAVAILABLE;

    response.status(status);

    return readinessView;
  }
}
