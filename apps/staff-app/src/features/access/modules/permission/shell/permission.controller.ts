import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequiresPermission } from '@acme-libs/auth';
import { PermissionCodeEnum } from '@acme-libs/kernel';

import { PermissionGetManyCase } from '../application';
import { PermissionGetManyResponseDto } from '../presentation';

@ApiTags('Access/Permission')
@Controller('access/permissions')
export class PermissionController {
  constructor(private readonly getManyCase: PermissionGetManyCase) {}

  @Get()
  @RequiresPermission(PermissionCodeEnum.ACCESS_MANAGE)
  @ApiOperation({ summary: 'List every permission code' })
  @ApiOkResponse({ type: PermissionGetManyResponseDto })
  public getMany(): PermissionGetManyResponseDto {
    return this.getManyCase.execute();
  }
}
