import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequiresPermission } from '@acme-libs/auth';
import { PermissionCodeEnum } from '@acme-libs/kernel';

import { LedgerListEntriesCase } from '../application';
import { LedgerEntryPageResponseDto, LedgerListEntriesQueryDto } from '../presentation';

@ApiTags('Ledger')
@Controller('ledger')
export class LedgerController {
  constructor(private readonly listEntriesCase: LedgerListEntriesCase) {}

  @Get()
  @RequiresPermission(PermissionCodeEnum.LEDGER_READ)
  @ApiOperation({ summary: 'Browse the append-only ledger, newest first' })
  @ApiOkResponse({ type: LedgerEntryPageResponseDto })
  public async listEntries(
    @Query() query: LedgerListEntriesQueryDto,
  ): Promise<LedgerEntryPageResponseDto> {
    const { page, limit, subjectType, subjectId, correlationId } = query;

    return await this.listEntriesCase.execute({
      page,
      limit,
      subjectType,
      subjectId,
      correlationId,
    });
  }
}
