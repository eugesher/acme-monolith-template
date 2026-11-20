import { Module } from '@nestjs/common';

import { STAFF_AUTH_COMMON_PORT } from '@acme-staff/contracts/staff-auth';

import { StaffAuthCommonFindSubjectUseCase } from '../application';
import { StaffAuthCommonFindSubjectRepository } from '../infrastructure';
import { StaffAuthCommonFacade } from './staff-auth-common.facade';

@Module({
  exports: [STAFF_AUTH_COMMON_PORT],
  providers: [
    { provide: STAFF_AUTH_COMMON_PORT, useClass: StaffAuthCommonFacade },
    StaffAuthCommonFindSubjectUseCase,
    StaffAuthCommonFindSubjectRepository.provider,
  ],
})
export class StaffAuthCommonModule {}
