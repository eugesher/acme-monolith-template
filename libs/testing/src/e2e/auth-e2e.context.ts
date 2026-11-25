import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Type } from '@nestjs/common';

import {
  AuthMetadataKeyEnum,
  AuthTokenAlgorithmEnum,
  type AppNameEnum,
  type AuthAudienceEnum,
} from '@acme-libs/kernel';
import type { Maybe } from '@acme-libs/toolkit';

import { E2EContext } from './e2e.context';

export class AuthE2EContext extends E2EContext {
  public get jwtService(): JwtService {
    if (!this._jwtService) {
      throw new Error('The e2e context is read before init(): use it inside it() and hooks');
    }

    return this._jwtService;
  }

  private _jwtService: Maybe<JwtService>;

  constructor(
    appModule: Type<unknown>,
    appName: AppNameEnum,
    private readonly audience: AuthAudienceEnum,
  ) {
    super(appModule, appName);
  }

  public override async init(): Promise<void> {
    await super.init();

    const config = this.moduleFixture.get(ConfigService);
    const secret = config.getOrThrow<string>('JWT_SECRET');
    const algorithm = AuthTokenAlgorithmEnum.HS256;

    this._jwtService = new JwtService({
      secret,
      signOptions: { algorithm, audience: this.audience },
    });
  }

  public routeAccess(): [string, string][] {
    const reflector = this.app.get(Reflector);

    return this.routes().map(({ route, targets }) => {
      const isPublic = reflector.getAllAndOverride<Maybe<boolean>>(
        AuthMetadataKeyEnum.PUBLIC,
        targets,
      );
      const permission = reflector.getAllAndOverride<Maybe<string>>(
        AuthMetadataKeyEnum.PERMISSION,
        targets,
      );

      return [route, isPublic ? 'public' : (permission ?? 'authenticated')];
    });
  }
}
