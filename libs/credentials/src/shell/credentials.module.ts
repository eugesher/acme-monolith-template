import { ConfigService } from '@nestjs/config';
import { JwtModule, type JwtSignOptions } from '@nestjs/jwt';
import type { ClassProvider, DynamicModule } from '@nestjs/common';

import { AuthTokenAlgorithmEnum, type AuthAudienceEnum } from '@acme-libs/kernel';
import { CREDENTIALS_PORT, type ICredentialsPort } from '@acme-libs/contracts/credentials';

import {
  CredentialsHashPasswordUseCase,
  CredentialsSignAccessTokenUseCase,
  CredentialsVerifyAccessTokenUseCase,
  CredentialsVerifyPasswordUseCase,
} from '../application';
import { CredentialsAccessTokenAdapter, CredentialsPasswordHasherAdapter } from '../infrastructure';
import { CredentialsFacade } from './credentials.facade';

export class CredentialsModule {
  public static forRoot(audience: AuthAudienceEnum): DynamicModule {
    return {
      module: CredentialsModule,
      global: true,
      imports: [CredentialsModule.registerJwt(audience)],
      exports: [CREDENTIALS_PORT],
      providers: [
        {
          provide: CREDENTIALS_PORT,
          useClass: CredentialsFacade,
        } satisfies ClassProvider<ICredentialsPort>,
        CredentialsSignAccessTokenUseCase,
        CredentialsVerifyAccessTokenUseCase,
        CredentialsHashPasswordUseCase,
        CredentialsVerifyPasswordUseCase,
        CredentialsAccessTokenAdapter.PROVIDER,
        CredentialsPasswordHasherAdapter.PROVIDER,
      ],
    };
  }

  private static registerJwt(audience: AuthAudienceEnum): DynamicModule {
    return JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          algorithm: AuthTokenAlgorithmEnum.HS256,
          audience,
          expiresIn: config.getOrThrow<string>('JWT_EXPIRES_IN') as JwtSignOptions['expiresIn'],
        },
        verifyOptions: { algorithms: [AuthTokenAlgorithmEnum.HS256], audience },
      }),
    });
  }
}
