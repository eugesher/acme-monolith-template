import { Global, Module, type ClassProvider } from '@nestjs/common';

import { AuthJwtModule } from '@acme-libs/auth';
import { AUTH_USER_VALIDATOR_PORT, type IAuthUserValidatorPort } from '@acme-libs/contracts/auth';

import { AuthGlobalValidateSubjectUseCase } from '../application';
import {
  AuthGlobalCredentialsLibAdapter,
  AuthGlobalValidateSubjectRepository,
} from '../infrastructure';
import { AuthGlobalFacade } from './auth-global.facade';

@Global()
@Module({
  imports: [AuthJwtModule],
  exports: [AUTH_USER_VALIDATOR_PORT],
  providers: [
    {
      provide: AUTH_USER_VALIDATOR_PORT,
      useClass: AuthGlobalFacade,
    } satisfies ClassProvider<IAuthUserValidatorPort>,
    AuthGlobalValidateSubjectUseCase,
    AuthGlobalValidateSubjectRepository.provider,
    AuthGlobalCredentialsLibAdapter.provider,
  ],
})
export class AuthGlobalModule {}
