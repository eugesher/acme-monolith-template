import '../support/lint';
import { Scaffold } from '../support/scaffold';

describe('app entities (@acme-<app>/common/entities)', () => {
  let scaffold: Scaffold;

  beforeAll(() => {
    scaffold = Scaffold.create([
      'apps/__entities-fixture__/src/common/entities/index.ts',
      'apps/__entities-fixture__/src/common/entities/note/note-revision.entity.ts',
      'core/entities/src/index.ts',
      'core/contracts/src/__ledger-fixture__/index.ts',
    ]);
  });

  afterAll(() => {
    scaffold.remove();
  });

  it('a repository may NOT reach a deep path into the entities of its app', async () => {
    await expect({
      file: 'apps/staff-app/src/features/product/infrastructure/persistence/repositories/__fixture__.ts',
      code: 'import { Note } from "@acme-staff/common/entities/note/note.entity";',
    }).toBreakRule('no-restricted-imports');
  });

  it.each([
    ['apps/__entities-fixture__/src/app/entities/index.ts', '../../common/entities'],
    [
      'apps/__entities-fixture__/src/app/global/auth/infrastructure/persistence/repositories/__fixture__.ts',
      '../../../../../../common/entities',
    ],
    [
      'apps/__entities-fixture__/src/features/product/infrastructure/persistence/repositories/__fixture__.ts',
      '../../../../../common/entities',
    ],
    [
      'apps/__entities-fixture__/src/common/modules/idempotency/infrastructure/persistence/repositories/__fixture__.ts',
      '../../../../../entities',
    ],
  ])('%s MAY import the entities of its app', async (file, source) => {
    await expect({
      file,
      code: `import { Note } from "${source}";`,
    }).toPassArchitectureLint();
  });

  it.each([
    [
      'apps/__entities-fixture__/src/features/product/domain/__fixture__.ts',
      '../../../common/entities',
    ],
    [
      'apps/__entities-fixture__/src/features/product/outbound/__fixture__.ts',
      '../../../common/entities',
    ],
    [
      'apps/__entities-fixture__/src/features/product/application/use-cases/__fixture__.ts',
      '../../../../common/entities',
    ],
    [
      'apps/__entities-fixture__/src/features/product/presentation/controllers/__fixture__.ts',
      '../../../../common/entities',
    ],
    ['apps/__entities-fixture__/src/features/product/product.module.ts', '../../common/entities'],
    ['apps/__entities-fixture__/src/common/shared/auth/__fixture__.ts', '../../entities'],
    ['apps/__entities-fixture__/src/main.ts', './common/entities'],
  ])(
    '%s may NOT import the entities of its app, a table is reached only through a repository',
    async (file, source) => {
      await expect({
        file,
        code: `import { Note } from "${source}";`,
      }).toBreakRule('boundaries/dependencies');
    },
  );

  it.each([
    [
      'apps/__other-entities-fixture__/src/features/order/infrastructure/persistence/repositories/__fixture__.ts',
      '../../../../../../../__entities-fixture__/src/common/entities',
    ],
    [
      'apps/__other-entities-fixture__/src/processors/purge/infrastructure/__fixture__.ts',
      '../../../../../__entities-fixture__/src/common/entities',
    ],
    [
      'core/modules/src/__ledger-fixture__/infrastructure/persistence/__fixture__.ts',
      '../../../../../../apps/__entities-fixture__/src/common/entities',
    ],
  ])('%s may NOT import the entities of another app', async (file, source) => {
    await expect({
      file,
      code: `import { Note } from "${source}";`,
    }).toBreakRule('boundaries/dependencies');
  });

  it('an app entity MAY import typeorm, the kernel lib, the core entities and its siblings', async () => {
    await expect({
      file: 'apps/__entities-fixture__/src/common/entities/note/__fixture__.ts',
      code: 'import { Entity } from "typeorm";\nimport { ProductStatusEnum } from "@acme-libs/kernel";\nimport { Product } from "@acme-core/entities";\nimport { NoteRevision } from "./note-revision.entity";',
    }).toPassArchitectureLint();
  });

  it.each([
    '@nestjs/common',
    'class-validator',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-core/contracts/__ledger-fixture__',
  ])(
    'an app entity may NOT import %s — a table carries no framework or module code',
    async (source) => {
      await expect({
        file: 'apps/__entities-fixture__/src/common/entities/note/__fixture__.ts',
        code: `import { x } from "${source}";`,
      }).toBreakRule('boundaries/dependencies');
    },
  );
});
