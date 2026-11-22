import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { Customer } from '@acme-core/entities';

import { AuthGlobalPersistenceCustomerBuilder } from '../builders/auth-global-persistence-customer.builder';

export abstract class AuthGlobalPersistenceHost {
  protected get customerRepository(): IHostedRepository<Customer> {
    return this.orm.getRepository(Customer);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createCustomerBuilder(): AuthGlobalPersistenceCustomerBuilder {
    return new AuthGlobalPersistenceCustomerBuilder(
      this.customerRepository.createQueryBuilder(Customer.name),
    );
  }
}
