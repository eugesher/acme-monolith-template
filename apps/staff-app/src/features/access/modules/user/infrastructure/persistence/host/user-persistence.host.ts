import { StaffRole, StaffUser, StaffUserRole } from '@acme-core/entities';
import type { IHostedRepository, IOrmPort } from '@acme-libs/contracts/database';

import { UserPersistenceStaffRoleBuilder } from '../builders/user-persistence-staff-role.builder';

export abstract class UserPersistenceHost {
  protected abstract readonly orm: IOrmPort;

  protected get staffUserRepository(): IHostedRepository<StaffUser> {
    return this.orm.getRepository(StaffUser);
  }

  protected get staffUserRoleRepository(): IHostedRepository<StaffUserRole> {
    return this.orm.getRepository(StaffUserRole);
  }

  protected get staffRoleRepository(): IHostedRepository<StaffRole> {
    return this.orm.getRepository(StaffRole);
  }

  protected createStaffRoleBuilder(): UserPersistenceStaffRoleBuilder {
    return new UserPersistenceStaffRoleBuilder(
      this.staffRoleRepository.createQueryBuilder(StaffRole.name),
    );
  }
}
