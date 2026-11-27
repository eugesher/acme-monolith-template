import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequiresPermission } from '@acme-libs/auth';
import { PermissionCodeEnum } from '@acme-libs/kernel';

import { PermissionListCase } from '../application';
import { PermissionListResponseDto } from '../presentation';

@ApiTags('Access/Permission')
@Controller('access/permissions')
export class PermissionController {
  constructor(private readonly listCase: PermissionListCase) {}

  @Get()
  @RequiresPermission(PermissionCodeEnum.ACCESS_MANAGE)
  @ApiOperation({ summary: 'List every permission code' })
  @ApiOkResponse({ type: PermissionListResponseDto })
  public list(): PermissionListResponseDto {
    return this.listCase.execute();
  }
}
