import { ConfigService } from '@nestjs/config';
import { JwtModule, type JwtSignOptions } from '@nestjs/jwt';
import type { ClassProvider, DynamicModule } from '@nestjs/common';

import { AuthTokenAlgorithmEnum, type AuthAudienceEnum } from '@acme-libs/kernel';
import { CREDENTIALS_LIB_PORT, type ICredentialsLibPort } from '@acme-libs/contracts/credentials';

import {
  CredentialsLibHashPasswordUseCase,
  CredentialsLibSignAccessTokenUseCase,
  CredentialsLibVerifyAccessTokenUseCase,
  CredentialsLibVerifyPasswordUseCase,
} from '../application';
import {
  CredentialsLibAccessTokenAdapter,
  CredentialsLibPasswordHasherAdapter,
} from '../infrastructure';
import { CredentialsLibFacade } from './credentials-lib.facade';

export class CredentialsLibModule {
  public static forRoot(audience: AuthAudienceEnum): DynamicModule {
    return {
      module: CredentialsLibModule,
      global: true,
      imports: [CredentialsLibModule.registerJwt(audience)],
      exports: [CREDENTIALS_LIB_PORT],
      providers: [
        {
          provide: CREDENTIALS_LIB_PORT,
          useClass: CredentialsLibFacade,
        } satisfies ClassProvider<ICredentialsLibPort>,
        CredentialsLibSignAccessTokenUseCase,
        CredentialsLibVerifyAccessTokenUseCase,
        CredentialsLibHashPasswordUseCase,
        CredentialsLibVerifyPasswordUseCase,
        CredentialsLibAccessTokenAdapter.provider,
        CredentialsLibPasswordHasherAdapter.provider,
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
