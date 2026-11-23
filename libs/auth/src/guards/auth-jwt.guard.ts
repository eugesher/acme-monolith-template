import {
  Inject,
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AUTH_USER_VALIDATOR_PORT, type IAuthUserValidatorPort } from '@acme-libs/contracts/auth';
import type { Maybe } from '@acme-libs/toolkit';

import { AuthMetadataKeyEnum, type IAuthRequest } from '../types';

@Injectable()
export class AuthJwtGuard implements CanActivate {
  constructor(
    @Inject(AUTH_USER_VALIDATOR_PORT)
    private readonly validator: IAuthUserValidatorPort,
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadataTargets = [context.getHandler(), context.getClass()];
    const isPublic = this.reflector.getAllAndOverride<Maybe<boolean>>(
      AuthMetadataKeyEnum.PUBLIC,
      metadataTargets,
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<IAuthRequest>();
    const [scheme, token] = (request.headers.authorization ?? '').split(/\s+/);

    if (scheme.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException();
    }

    const user = await this.validator.handleValidate({ token });

    if (!user) {
      throw new UnauthorizedException();
    }

    request.user = user;

    return true;
  }
}
