import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequiresPermission } from '@acme-libs/auth';
import { PermissionCodeEnum } from '@acme-libs/kernel';

import { LedgerGetManyCase } from '../application';
import { LedgerEntryPageResponseDto, LedgerGetManyQueryDto } from '../presentation';

@ApiTags('Ledger')
@Controller('ledger')
export class LedgerController {
  constructor(private readonly getManyCase: LedgerGetManyCase) {}

  @Get()
  @RequiresPermission(PermissionCodeEnum.LEDGER_READ)
  @ApiOperation({ summary: 'Browse the append-only ledger, newest first' })
  @ApiOkResponse({ type: LedgerEntryPageResponseDto })
  public async getMany(@Query() query: LedgerGetManyQueryDto): Promise<LedgerEntryPageResponseDto> {
    const { page, limit, subjectType, subjectId, correlationId } = query;

    return await this.getManyCase.execute({
      page,
      limit,
      subjectType,
      subjectId,
      correlationId,
    });
  }
}
