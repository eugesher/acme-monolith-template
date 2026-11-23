import { Global, Module, type ClassProvider } from '@nestjs/common';

import { AuthJwtModule, AuthPermissionModule } from '@acme-libs/auth';
import { AUTH_USER_VALIDATOR_PORT, type IAuthUserValidatorPort } from '@acme-libs/contracts/auth';
import { AuthCommonModule } from '@acme-staff/common/modules';

import { AuthGlobalValidateSubjectUseCase } from '../application';
import { AuthGlobalCredentialsLibAdapter, AuthGlobalSubjectCommonAdapter } from '../infrastructure';
import { AuthGlobalFacade } from './auth-global.facade';

@Global()
@Module({
  imports: [AuthJwtModule, AuthPermissionModule, AuthCommonModule],
  exports: [AUTH_USER_VALIDATOR_PORT],
  providers: [
    {
      provide: AUTH_USER_VALIDATOR_PORT,
      useClass: AuthGlobalFacade,
    } satisfies ClassProvider<IAuthUserValidatorPort>,
    AuthGlobalValidateSubjectUseCase,
    AuthGlobalSubjectCommonAdapter.PROVIDER,
    AuthGlobalCredentialsLibAdapter.PROVIDER,
  ],
})
export class AuthGlobalModule {}
