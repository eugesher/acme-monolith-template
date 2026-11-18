import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { StaffUser } from '@acme-core/entities';

import { AuthPersistenceStaffUserBuilder } from '../builders/auth-persistence-staff-user.builder';

export abstract class AuthPersistenceHost {
  protected get staffUserRepository(): IHostedRepository<StaffUser> {
    return this.orm.getRepository(StaffUser);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createStaffUserBuilder(): AuthPersistenceStaffUserBuilder {
    return new AuthPersistenceStaffUserBuilder(
      this.staffUserRepository.createQueryBuilder(StaffUser.name),
    );
  }
}
