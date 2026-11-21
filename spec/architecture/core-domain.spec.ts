import '../support/lint';
import { Scaffold } from '../support/scaffold';

describe('core domain (@acme-core/domain)', () => {
  let scaffold: Scaffold;

  beforeAll(() => {
    scaffold = Scaffold.create([
      'core/domain/src/index.ts',
      'core/domain/src/__fixture__/fixture.value.ts',
      'core/entities/src/index.ts',
      'core/modules/src/__product-fixture__/index.ts',
    ]);
  });

  afterAll(() => {
    scaffold.remove();
  });

  it('@acme-core/domain resolves', () => {
    expect('@acme-core/domain').toResolve();
  });

  it('a domain layer may NOT reach a deep path into the core domain', async () => {
    await expect({
      file: 'apps/staff-app/src/features/product/domain/__fixture__.ts',
      code: 'import { EmailValue } from "@acme-core/domain/__fixture__/fixture.value";',
    }).toBreakRule('no-restricted-imports');
  });

  it.each([
    'apps/staff-app/src/features/product/domain/__fixture__.ts',
    'apps/staff-app/src/features/product/application/use-cases/__fixture__.ts',
    'apps/processor-app/src/processors/purge/domain/__fixture__.ts',
    'apps/staff-app/src/common/modules/idempotency/domain/__fixture__.ts',
    'apps/staff-app/src/common/modules/idempotency/application/__fixture__.ts',
    'core/modules/src/__ledger-fixture__/domain/__fixture__.ts',
    'core/modules/src/__ledger-fixture__/application/__fixture__.ts',
  ])('%s MAY import the core domain', async (file) => {
    await expect({
      file,
      code: 'import { EmailValue } from "@acme-core/domain";',
    }).toPassArchitectureLint();
  });

  it.each([
    'apps/staff-app/src/features/product/outbound/__fixture__.ts',
    'apps/staff-app/src/features/product/infrastructure/__fixture__.ts',
    'apps/staff-app/src/features/product/presentation/controllers/__fixture__.ts',
    'apps/staff-app/src/features/product/product.module.ts',
    'core/modules/src/__ledger-fixture__/infrastructure/__fixture__.ts',
    'core/entities/src/__fixture__.ts',
    'libs/http/src/__fixture__.ts',
  ])(
    '%s may NOT import the core domain, a value object serves the domain and the use case',
    async (file) => {
      await expect({
        file,
        code: 'import { EmailValue } from "@acme-core/domain";',
      }).toBreakRule('boundaries/dependencies');
    },
  );

  it('the core domain MAY import the domain lib', async () => {
    await expect({
      file: 'core/domain/src/email/__fixture__.ts',
      code: 'import { ValueObject } from "@acme-libs/domain";',
    }).toPassArchitectureLint();
  });

  it.each([
    'import { Product } from "@acme-core/entities";',
    'import { ProductCoreModule } from "@acme-core/modules/__product-fixture__";',
    'import { Injectable } from "@nestjs/common";',
  ])('the core domain may NOT take %s', async (code) => {
    await expect({
      file: 'core/domain/src/email/__fixture__.ts',
      code,
    }).toBreakRule('boundaries/dependencies');
  });
});
