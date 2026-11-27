import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseFilters } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser, Public } from '@acme-libs/auth';
import { ApiErrorResponses, AuthThrottle } from '@acme-libs/http';
import { IdentityExceptionCodeEnum } from '@acme-libs/kernel';
import type { IAuthCurrentUserView } from '@acme-libs/contracts/auth';

import { AuthLoginCase, AuthMeCase } from '../application';
import {
  AuthAccessTokenResponseDto,
  AuthHttpExceptionFilter,
  AuthLoginRequestDto,
  AuthMeResponseDto,
} from '../presentation';

@ApiTags('Auth')
@UseFilters(AuthHttpExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginCase: AuthLoginCase,
    private readonly meCase: AuthMeCase,
  ) {}

  @Post('login')
  @Public()
  @AuthThrottle()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Exchange staff credentials for an access token' })
  @ApiOkResponse({ type: AuthAccessTokenResponseDto })
  @ApiErrorResponses({
    filterStatus: AuthHttpExceptionFilter.STATUS,
    codes: [
      IdentityExceptionCodeEnum.AUTH_INVALID_CREDENTIALS,
      IdentityExceptionCodeEnum.AUTH_USER_INACTIVE,
    ],
  })
  public async login(@Body() body: AuthLoginRequestDto): Promise<AuthAccessTokenResponseDto> {
    const { email, password } = body;

    return await this.loginCase.execute({ email, password });
  }

  @Get('me')
  @ApiOperation({ summary: 'The authenticated staff user and the roles they hold' })
  @ApiOkResponse({ type: AuthMeResponseDto })
  @ApiErrorResponses({
    filterStatus: AuthHttpExceptionFilter.STATUS,
    codes: [IdentityExceptionCodeEnum.AUTH_USER_NOT_FOUND],
  })
  public async me(@CurrentUser() user: IAuthCurrentUserView): Promise<AuthMeResponseDto> {
    const { id } = user;

    return await this.meCase.execute({ userId: id });
  }
}
