import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { StaffUser } from '@acme-core/entities';

import { StaffAuthCorePersistenceStaffUserBuilder } from '../builders/staff-auth-core-persistence-staff-user.builder';

export abstract class StaffAuthCorePersistenceHost {
  protected get staffUserRepository(): IHostedRepository<StaffUser> {
    return this.orm.getRepository(StaffUser);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createStaffUserBuilder(): StaffAuthCorePersistenceStaffUserBuilder {
    return new StaffAuthCorePersistenceStaffUserBuilder(
      this.staffUserRepository.createQueryBuilder(StaffUser.name),
    );
  }
}
