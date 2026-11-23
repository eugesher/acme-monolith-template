import '../support/lint';
import { Scaffold } from '../support/scaffold';

describe('core queues (@acme-core/queues)', () => {
  let scaffold: Scaffold;

  beforeAll(() => {
    scaffold = Scaffold.create([
      'core/queues/src/index.ts',
      'core/queues/src/__fixture__/fixture-queue.module.ts',
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
      code: 'import { LedgerQueueModule } from "@acme-core/queues/__fixture__/fixture-queue.module";',
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
      code: 'import { LedgerQueueModule } from "@acme-core/queues";',
    }).toPassArchitectureLint();
  });

  it.each([
    'apps/staff-app/src/features/queue/infrastructure/queue/queue-registry.adapter.ts',
    'apps/staff-app/src/features/queue/application/use-cases/__fixture__.ts',
    'apps/processor-app/src/processors/ledger-append/shell/__fixture__.ts',
    'apps/staff-app/src/common/shared/ledger/__fixture__.ts',
    'core/modules/src/ledger/infrastructure/queue/ledger-core-queue.adapter.ts',
    'libs/queue/src/__fixture__.ts',
  ])(
    '%s may NOT import the core queues, the module root that binds the queue adapter registers a queue',
    async (file) => {
      await expect({
        file,
        code: 'import { LedgerQueueModule } from "@acme-core/queues";',
      }).toBreakRule('boundaries/dependencies');
    },
  );

  it.each([
    'import type { DynamicModule } from "@nestjs/common";',
    'import { BullSetupModule } from "@acme-libs/queue";',
    'import { LEDGER_RECORD_QUEUE } from "@acme-core/contracts/__ledger-fixture__";',
  ])('the core queues MAY take %s', async (code) => {
    await expect({
      file: 'core/queues/src/ledger/__fixture__.ts',
      code,
    }).toPassArchitectureLint();
  });

  it.each([
    'import { LedgerEntry } from "@acme-core/entities";',
    'import { LedgerCoreModule } from "@acme-core/modules/__ledger-fixture__";',
    'import { BullModule } from "@nestjs/bullmq";',
  ])('the core queues may NOT take %s', async (code) => {
    await expect({
      file: 'core/queues/src/ledger/__fixture__.ts',
      code,
    }).toBreakRule('boundaries/dependencies');
  });
});
