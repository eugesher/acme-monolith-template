import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { StaffUser } from '@acme-staff/common/entities';

import { StaffAuthCommonPersistenceStaffUserBuilder } from '../builders/staff-auth-common-persistence-staff-user.builder';

export abstract class StaffAuthCommonPersistenceHost {
  protected get staffUserRepository(): IHostedRepository<StaffUser> {
    return this.orm.getRepository(StaffUser);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createStaffUserBuilder(): StaffAuthCommonPersistenceStaffUserBuilder {
    return new StaffAuthCommonPersistenceStaffUserBuilder(
      this.staffUserRepository.createQueryBuilder(StaffUser.name),
    );
  }
}
