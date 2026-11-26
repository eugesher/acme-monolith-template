import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { StaffUser } from '@acme-staff/common/entities';

import { AuthCommonPersistenceStaffUserBuilder } from '../builders/auth-common-persistence-staff-user.builder';

export abstract class AuthCommonPersistenceHost {
  protected get staffUserRepository(): IHostedRepository<StaffUser> {
    return this.orm.getRepository(StaffUser);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createStaffUserBuilder(): AuthCommonPersistenceStaffUserBuilder {
    return new AuthCommonPersistenceStaffUserBuilder(
      this.staffUserRepository.createQueryBuilder(StaffUser.name),
    );
  }
}
