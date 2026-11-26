import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { StaffRole, StaffRolePermission } from '@acme-staff/common/entities';

import { RolePersistenceStaffRoleBuilder } from '../builders/role-persistence-staff-role.builder';

export abstract class RolePersistenceHost {
  protected get staffRolePermissionRepository(): IHostedRepository<StaffRolePermission> {
    return this.orm.getRepository(StaffRolePermission);
  }

  protected get staffRoleRepository(): IHostedRepository<StaffRole> {
    return this.orm.getRepository(StaffRole);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createStaffRoleBuilder(): RolePersistenceStaffRoleBuilder {
    return new RolePersistenceStaffRoleBuilder(
      this.staffRoleRepository.createQueryBuilder(StaffRole.name),
    );
  }
}
