import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Type } from '@nestjs/common';

import { AuthTokenAlgorithmEnum, type AppNameEnum, type AuthAudienceEnum } from '@acme-libs/kernel';
import type { Maybe } from '@acme-libs/toolkit';

import { E2EContext } from './e2e.context';

export class AuthE2EContext extends E2EContext {
  public get jwt(): JwtService {
    if (!this.signer) {
      throw new Error('The e2e context is read before init(): use it inside it() and hooks');
    }

    return this.signer;
  }

  private static readonly PUBLIC_METADATA = 'auth:public';
  private static readonly PERMISSION_METADATA = 'auth:permission';

  private signer: Maybe<JwtService>;

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

    this.signer = new JwtService({ secret, signOptions: { algorithm, audience: this.audience } });
  }

  public routeAccess(): [string, string][] {
    const reflector = this.app.get(Reflector);

    return this.routes().map(({ route, targets }) => {
      const isPublic = reflector.getAllAndOverride<Maybe<boolean>>(
        AuthE2EContext.PUBLIC_METADATA,
        targets,
      );
      const permission = reflector.getAllAndOverride<Maybe<string>>(
        AuthE2EContext.PERMISSION_METADATA,
        targets,
      );

      return [route, isPublic ? 'public' : (permission ?? 'authenticated')];
    });
  }
}
