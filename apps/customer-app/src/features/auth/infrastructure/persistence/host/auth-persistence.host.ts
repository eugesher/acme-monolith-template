import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { Customer } from '@acme-core/entities';

import { AuthPersistenceCustomerBuilder } from '../builders/auth-persistence-customer.builder';

export abstract class AuthPersistenceHost {
  protected get customerRepository(): IHostedRepository<Customer> {
    return this.orm.getRepository(Customer);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createCustomerBuilder(): AuthPersistenceCustomerBuilder {
    return new AuthPersistenceCustomerBuilder(
      this.customerRepository.createQueryBuilder(Customer.name),
    );
  }
}
