import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { StaffRole, StaffUser, StaffUserRole } from '@acme-core/entities';

import { UserPersistenceStaffRoleBuilder } from '../builders/user-persistence-staff-role.builder';

export abstract class UserPersistenceHost {
  protected get staffUserRepository(): IHostedRepository<StaffUser> {
    return this.orm.getRepository(StaffUser);
  }

  protected get staffUserRoleRepository(): IHostedRepository<StaffUserRole> {
    return this.orm.getRepository(StaffUserRole);
  }

  protected get staffRoleRepository(): IHostedRepository<StaffRole> {
    return this.orm.getRepository(StaffRole);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createStaffRoleBuilder(): UserPersistenceStaffRoleBuilder {
    return new UserPersistenceStaffRoleBuilder(
      this.staffRoleRepository.createQueryBuilder(StaffRole.name),
    );
  }
}
