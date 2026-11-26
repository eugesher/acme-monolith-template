import { Module, type ClassProvider } from '@nestjs/common';

import { AUTH_COMMON_PORT, type IAuthCommonPort } from '@acme-staff/contracts/auth';

import { AuthCommonFindSubjectUseCase } from '../application';
import { AuthCommonFindSubjectRepository } from '../infrastructure';
import { AuthCommonFacade } from './auth-common.facade';

@Module({
  exports: [AUTH_COMMON_PORT],
  providers: [
    {
      provide: AUTH_COMMON_PORT,
      useClass: AuthCommonFacade,
    } satisfies ClassProvider<IAuthCommonPort>,
    AuthCommonFindSubjectUseCase,
    AuthCommonFindSubjectRepository.PROVIDER,
  ],
})
export class AuthCommonModule {}
