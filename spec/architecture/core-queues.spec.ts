import '../support/lint';
import { Scaffold } from '../support/scaffold';

describe('core queues (@acme-core/queues)', () => {
  let scaffold: Scaffold;

  beforeAll(() => {
    scaffold = Scaffold.create([
      'core/queues/src/index.ts',
      'core/contracts/src/__ledger-fixture__/index.ts',
      'core/entities/src/index.ts',
      'core/modules/src/__ledger-fixture__/index.ts',
    ]);
  });

  afterAll(() => {
    scaffold.remove();
  });

  it('@acme-core/queues resolves', () => {
    expect('@acme-core/queues').toResolve();
  });

  it('a module root may NOT reach a deep path into the core queues', async () => {
    await expect({
      file: 'apps/staff-app/src/features/queue/shell/queue.module.ts',
      code: 'import { LedgerAppendQueue } from "@acme-core/queues/definitions/ledger-append.queue";',
    }).toBreakRule('no-restricted-imports');
  });

  it.each([
    'apps/staff-app/src/features/queue/shell/queue.module.ts',
    'core/modules/src/ledger/shell/ledger-core.module.ts',
    'core/modules/src/product-stock/shell/product-stock-core.module.ts',
    'apps/processor-app/src/processors/ledger-append/shell/ledger-append.module.ts',
  ])('%s MAY register a queue of the core queues', async (file) => {
    await expect({
      file,
      code: 'import { LedgerAppendQueue } from "@acme-core/queues";',
    }).toPassArchitectureLint();
  });

  it.each([
    'apps/staff-app/src/features/queue/infrastructure/queue/queue-registry.adapter.ts',
    'core/modules/src/ledger/infrastructure/queue/ledger-core-queue.adapter.ts',
    'apps/processor-app/src/processors/ledger-append/shell/ledger-append.processor.ts',
    'apps/staff-app/test/context/app-e2e.context.ts',
    'test/system/apps/staff-app/context/app-e2e.context.ts',
  ])('%s MAY take the name of a queue of the core queues', async (file) => {
    await expect({
      file,
      code: 'import { LedgerAppendQueue } from "@acme-core/queues";',
    }).toPassArchitectureLint();
  });

  it.each([
    'apps/staff-app/src/features/queue/application/cases/__fixture__.ts',
    'core/modules/src/ledger/application/__fixture__.ts',
    'core/contracts/src/__ledger-fixture__/__fixture__.ts',
    'libs/queue/src/__fixture__.ts',
  ])(
    '%s may NOT import the core queues — a queue adapter, a processor or a module root does',
    async (file) => {
      await expect({
        file,
        code: 'import { LedgerAppendQueue } from "@acme-core/queues";',
      }).toBreakRule('boundaries/dependencies');
    },
  );

  it.each([
    'import type { DynamicModule } from "@nestjs/common";',
    'import { BullSetupModule } from "@acme-libs/queue";',
  ])('the core queues MAY take %s', async (code) => {
    await expect({
      file: 'core/queues/src/definitions/__fixture__.ts',
      code,
    }).toPassArchitectureLint();
  });

  it.each([
    'import { LedgerEntry } from "@acme-core/entities";',
    'import { LedgerCoreModule } from "@acme-core/modules/__ledger-fixture__";',
    'import { x } from "@acme-core/contracts/__ledger-fixture__";',
    'import { BullModule } from "@nestjs/bullmq";',
  ])('the core queues may NOT take %s — a definition holds its name itself', async (code) => {
    await expect({
      file: 'core/queues/src/definitions/__fixture__.ts',
      code,
    }).toBreakRule('boundaries/dependencies');
  });
});
