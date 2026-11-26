import { SelectQueryBuilder } from 'typeorm';

import type { StaffUser } from '@acme-staff/common/entities';

export class AuthPersistenceStaffUserBuilder extends SelectQueryBuilder<StaffUser> {
  public forEmail(email: string): this {
    this.select([`${this.alias}.id`, `${this.alias}.passwordHash`, `${this.alias}.status`]).where(
      `${this.alias}.email = :email`,
      { email },
    );

    return this;
  }
}
