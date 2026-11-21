import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseFilters } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser, Public } from '@acme-libs/auth';
import { ApiErrorResponses, AuthThrottle } from '@acme-libs/http';
import { IdentityExceptionCodeEnum } from '@acme-libs/kernel';
import type { IAuthCurrentUserView } from '@acme-libs/contracts/auth';

import { AuthLoginUseCase, AuthRegisterUseCase } from '../../application';
import {
  AuthAccessTokenResponseDto,
  AuthLoginRequestDto,
  AuthMeResponseDto,
  AuthRegisterRequestDto,
  AuthRegisterResponseDto,
} from '../dto';
import { AuthHttpExceptionFilter } from '../filters/auth-http-exception.filter';

@ApiTags('Auth')
@UseFilters(AuthHttpExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly register: AuthRegisterUseCase,
    private readonly login: AuthLoginUseCase,
  ) {}

  @Post('register')
  @Public()
  @AuthThrottle()
  @ApiOperation({ summary: 'Sign up as a customer; log in afterwards for a token' })
  @ApiCreatedResponse({ type: AuthRegisterResponseDto })
  @ApiErrorResponses({
    statuses: AuthHttpExceptionFilter.STATUS,
    codes: [
      IdentityExceptionCodeEnum.AUTH_EMAIL_INVALID,
      IdentityExceptionCodeEnum.AUTH_PASSWORD_TOO_WEAK,
      IdentityExceptionCodeEnum.AUTH_EMAIL_TAKEN,
    ],
  })
  public async handleRegister(
    @Body() body: AuthRegisterRequestDto,
  ): Promise<AuthRegisterResponseDto> {
    const { email, password } = body;

    return await this.register.execute({ email, password });
  }

  @Post('login')
  @Public()
  @AuthThrottle()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Exchange credentials for an access token' })
  @ApiOkResponse({ type: AuthAccessTokenResponseDto })
  @ApiErrorResponses({
    statuses: AuthHttpExceptionFilter.STATUS,
    codes: [
      IdentityExceptionCodeEnum.AUTH_INVALID_CREDENTIALS,
      IdentityExceptionCodeEnum.AUTH_USER_INACTIVE,
    ],
  })
  public async handleLogin(@Body() body: AuthLoginRequestDto): Promise<AuthAccessTokenResponseDto> {
    const { email, password } = body;

    return await this.login.execute({ email, password });
  }

  @Get('me')
  @ApiOperation({ summary: 'The authenticated customer, as the guards resolved them' })
  @ApiOkResponse({ type: AuthMeResponseDto })
  public handleMe(@CurrentUser() user: IAuthCurrentUserView): AuthMeResponseDto {
    const { id, email } = user;

    return { id, email };
  }
}
