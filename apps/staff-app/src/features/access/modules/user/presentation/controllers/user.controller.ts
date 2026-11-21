import { Body, Controller, Param, Post, Put, UseFilters } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequiresPermission } from '@acme-libs/auth';
import { ApiErrorResponses } from '@acme-libs/http';
import { IdentityExceptionCodeEnum, PermissionCodeEnum } from '@acme-libs/kernel';

import { UserReassignRolesUseCase, UserRegisterUseCase } from '../../application';
import {
  UserIdParamDto,
  UserRegisterRequestDto,
  UserResponseDto,
  UserRolesReassignRequestDto,
  UserRolesResponseDto,
} from '../dto';
import { UserHttpExceptionFilter } from '../filters/user-http-exception.filter';

@ApiTags('Access/User')
@UseFilters(UserHttpExceptionFilter)
@Controller('access/users')
export class UserController {
  constructor(
    private readonly register: UserRegisterUseCase,
    private readonly reassignRoles: UserReassignRolesUseCase,
  ) {}

  @Post()
  @RequiresPermission(PermissionCodeEnum.ACCESS_MANAGE)
  @ApiOperation({ summary: 'Create a principal' })
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiErrorResponses({
    statuses: UserHttpExceptionFilter.STATUS,
    codes: [
      IdentityExceptionCodeEnum.AUTH_EMAIL_INVALID,
      IdentityExceptionCodeEnum.AUTH_PASSWORD_TOO_WEAK,
      IdentityExceptionCodeEnum.AUTH_EMAIL_TAKEN,
      IdentityExceptionCodeEnum.AUTH_ROLE_NOT_FOUND,
    ],
  })
  public async handleRegister(@Body() body: UserRegisterRequestDto): Promise<UserResponseDto> {
    const { email, password, roleIds } = body;

    return await this.register.execute({ email, password, roleIds });
  }

  @Put(':userId/roles')
  @RequiresPermission(PermissionCodeEnum.ACCESS_MANAGE)
  @ApiOperation({ summary: 'Reassign the roles of a principal' })
  @ApiOkResponse({ type: UserRolesResponseDto })
  @ApiErrorResponses({
    statuses: UserHttpExceptionFilter.STATUS,
    codes: [
      IdentityExceptionCodeEnum.AUTH_USER_NOT_FOUND,
      IdentityExceptionCodeEnum.AUTH_ROLE_NOT_FOUND,
    ],
  })
  public async handleReassignRoles(
    @Param() params: UserIdParamDto,
    @Body() body: UserRolesReassignRequestDto,
  ): Promise<UserRolesResponseDto> {
    const { userId } = params;
    const { roleIds } = body;

    return await this.reassignRoles.execute({ userId, roleIds });
  }
}
