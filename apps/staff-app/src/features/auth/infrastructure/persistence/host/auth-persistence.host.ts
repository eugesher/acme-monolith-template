import { StaffUser } from '@acme-core/entities';
import type { IHostedRepository, IOrmPort } from '@acme-libs/contracts/database';

import { AuthPersistenceStaffUserBuilder } from '../builders/auth-persistence-staff-user.builder';

export abstract class AuthPersistenceHost {
  protected abstract readonly orm: IOrmPort;

  protected get staffUserRepository(): IHostedRepository<StaffUser> {
    return this.orm.getRepository(StaffUser);
  }

  protected createStaffUserBuilder(): AuthPersistenceStaffUserBuilder {
    return new AuthPersistenceStaffUserBuilder(
      this.staffUserRepository.createQueryBuilder(StaffUser.name),
    );
  }
}
