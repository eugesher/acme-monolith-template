import { Body, Controller, Get, Param, Post, Put, UseFilters } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequiresPermission } from '@acme-libs/auth';
import { ApiErrorResponses } from '@acme-libs/http';
import { IdentityExceptionCodeEnum, PermissionCodeEnum } from '@acme-libs/kernel';

import { RoleCreateUseCase, RoleListUseCase, RoleReassignPermissionsUseCase } from '../application';
import {
  RoleCreateRequestDto,
  RoleHttpExceptionFilter,
  RoleIdParamDto,
  RolePermissionsReassignRequestDto,
  RoleResponseDto,
} from '../presentation';

@ApiTags('Access/Role')
@UseFilters(RoleHttpExceptionFilter)
@Controller('access/roles')
export class RoleController {
  constructor(
    private readonly list: RoleListUseCase,
    private readonly create: RoleCreateUseCase,
    private readonly reassignPermissions: RoleReassignPermissionsUseCase,
  ) {}

  @Get()
  @RequiresPermission(PermissionCodeEnum.ACCESS_MANAGE)
  @ApiOperation({ summary: 'List roles and the permissions they grant' })
  @ApiOkResponse({ type: RoleResponseDto, isArray: true })
  public async handleList(): Promise<RoleResponseDto[]> {
    return await this.list.execute();
  }

  @Post()
  @RequiresPermission(PermissionCodeEnum.ACCESS_MANAGE)
  @ApiOperation({ summary: 'Create a role with its permissions' })
  @ApiCreatedResponse({ type: RoleResponseDto })
  @ApiErrorResponses({
    statuses: RoleHttpExceptionFilter.STATUS,
    codes: [IdentityExceptionCodeEnum.AUTH_ROLE_NAME_TAKEN],
  })
  public async handleCreate(@Body() body: RoleCreateRequestDto): Promise<RoleResponseDto> {
    const { name, permissionCodes } = body;

    return await this.create.execute({ name, permissionCodes });
  }

  @Put(':roleId/permissions')
  @RequiresPermission(PermissionCodeEnum.ACCESS_MANAGE)
  @ApiOperation({ summary: 'Reassign the permission set of a role' })
  @ApiOkResponse({ type: RoleResponseDto })
  @ApiErrorResponses({
    statuses: RoleHttpExceptionFilter.STATUS,
    codes: [IdentityExceptionCodeEnum.AUTH_ROLE_NOT_FOUND],
  })
  public async handleReassignPermissions(
    @Param() params: RoleIdParamDto,
    @Body() body: RolePermissionsReassignRequestDto,
  ): Promise<RoleResponseDto> {
    const { roleId } = params;
    const { permissionCodes } = body;

    return await this.reassignPermissions.execute({ roleId, permissionCodes });
  }
}
