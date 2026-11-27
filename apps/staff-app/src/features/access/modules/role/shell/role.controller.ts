import { Body, Controller, Get, Param, Post, Put, UseFilters } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequiresPermission } from '@acme-libs/auth';
import { ApiErrorResponses } from '@acme-libs/http';
import { IdentityExceptionCodeEnum, PermissionCodeEnum } from '@acme-libs/kernel';

import { RoleCreateCase, RoleGetManyCase, RoleReassignPermissionsCase } from '../application';
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
    private readonly getManyCase: RoleGetManyCase,
    private readonly createCase: RoleCreateCase,
    private readonly reassignPermissionsCase: RoleReassignPermissionsCase,
  ) {}

  @Get()
  @RequiresPermission(PermissionCodeEnum.ACCESS_MANAGE)
  @ApiOperation({ summary: 'List roles and the permissions they grant' })
  @ApiOkResponse({ type: RoleResponseDto, isArray: true })
  public async getMany(): Promise<RoleResponseDto[]> {
    return await this.getManyCase.execute();
  }

  @Post()
  @RequiresPermission(PermissionCodeEnum.ACCESS_MANAGE)
  @ApiOperation({ summary: 'Create a role with its permissions' })
  @ApiCreatedResponse({ type: RoleResponseDto })
  @ApiErrorResponses({
    filterStatus: RoleHttpExceptionFilter.STATUS,
    codes: [IdentityExceptionCodeEnum.AUTH_ROLE_NAME_TAKEN],
  })
  public async create(@Body() body: RoleCreateRequestDto): Promise<RoleResponseDto> {
    const { name, permissionCodes } = body;

    return await this.createCase.execute({ name, permissionCodes });
  }

  @Put(':roleId/permissions')
  @RequiresPermission(PermissionCodeEnum.ACCESS_MANAGE)
  @ApiOperation({ summary: 'Reassign the permission set of a role' })
  @ApiOkResponse({ type: RoleResponseDto })
  @ApiErrorResponses({
    filterStatus: RoleHttpExceptionFilter.STATUS,
    codes: [IdentityExceptionCodeEnum.AUTH_ROLE_NOT_FOUND],
  })
  public async reassignPermissions(
    @Param() params: RoleIdParamDto,
    @Body() body: RolePermissionsReassignRequestDto,
  ): Promise<RoleResponseDto> {
    const { roleId } = params;
    const { permissionCodes } = body;

    return await this.reassignPermissionsCase.execute({ roleId, permissionCodes });
  }
}
