import { SelectQueryBuilder } from 'typeorm';

import type { Customer } from '@acme-core/entities';

export class AuthPersistenceCustomerBuilder extends SelectQueryBuilder<Customer> {
  public forEmail(email: string): this {
    this.select([`${this.alias}.id`, `${this.alias}.passwordHash`, `${this.alias}.status`]).where(
      `${this.alias}.email = :email`,
      { email },
    );

    return this;
  }
}
