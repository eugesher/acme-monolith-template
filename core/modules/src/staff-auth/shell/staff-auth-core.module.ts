import { Module } from '@nestjs/common';

import { STAFF_AUTH_CORE_PORT } from '@acme-core/contracts/staff-auth';

import { StaffAuthCoreFindSubjectUseCase } from '../application';
import { StaffAuthCoreFindSubjectRepository } from '../infrastructure';
import { StaffAuthCoreFacade } from './staff-auth-core.facade';

@Module({
  exports: [STAFF_AUTH_CORE_PORT],
  providers: [
    { provide: STAFF_AUTH_CORE_PORT, useClass: StaffAuthCoreFacade },
    StaffAuthCoreFindSubjectUseCase,
    StaffAuthCoreFindSubjectRepository.provider,
  ],
})
export class StaffAuthCoreModule {}
