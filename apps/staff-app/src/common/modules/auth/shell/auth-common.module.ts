import { Module } from '@nestjs/common';

import { AUTH_COMMON_PORT } from '@acme-staff/contracts/auth';

import { AuthCommonFindSubjectUseCase } from '../application';
import { AuthCommonFindSubjectRepository } from '../infrastructure';
import { AuthCommonFacade } from './auth-common.facade';

@Module({
  exports: [AUTH_COMMON_PORT],
  providers: [
    { provide: AUTH_COMMON_PORT, useClass: AuthCommonFacade },
    AuthCommonFindSubjectUseCase,
    AuthCommonFindSubjectRepository.provider,
  ],
})
export class AuthCommonModule {}
