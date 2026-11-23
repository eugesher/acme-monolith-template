import '../support/lint';
import { Scaffold } from '../support/scaffold';

describe('global modules (global/) — modules without controllers', () => {
  let scaffold: Scaffold;

  beforeAll(() => {
    scaffold = Scaffold.create([
      'apps/__global-fixture__/src/global/index.ts',
      'apps/__global-fixture__/src/global/auth/index.ts',
      'apps/__global-fixture__/src/global/auth/shell/auth.module.ts',
      'apps/__global-fixture__/src/global/auth/infrastructure/index.ts',
      'apps/__global-fixture__/src/global/auth/infrastructure/common-adapters/index.ts',
      'apps/__global-fixture__/src/global/auth/infrastructure/lib-adapters/index.ts',
      'apps/__global-fixture__/src/global/auth/application/index.ts',
      'apps/__global-fixture__/src/global/auth/outbound/index.ts',
      'apps/__global-fixture__/src/common/modules/index.ts',
      'apps/__global-fixture__/src/common/modules/identity/index.ts',
      'apps/__global-fixture__/src/contracts/auth/index.ts',
      'apps/__global-fixture__/src/contracts/audit/index.ts',
      'apps/__global-fixture__/src/contracts/identity/index.ts',
      'apps/__global-fixture__/src/features/product/index.ts',
      'core/modules/src/__identity-fixture__/index.ts',
      'core/contracts/src/__identity-fixture__/index.ts',
      'core/entities/src/index.ts',
      'libs/contracts/src/credentials/index.ts',
    ]);
  });

  afterAll(() => {
    scaffold.remove();
  });

  it('bootstrap MAY reach the global modules index', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/app/__fixture__.ts',
      code: 'import { x } from "../global";',
    }).toPassArchitectureLint();
  });

  it('bootstrap may NOT reach a global module past the index', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/app/__fixture__.ts',
      code: 'import { x } from "../global/auth/shell/auth.module";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('the index MAY re-export the barrel of a global module', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/index.ts',
      code: 'export * from "./auth";',
    }).toPassArchitectureLint();
  });

  it('the index may NOT take a deep path into a global module', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/index.ts',
      code: 'export * from "./auth/shell/auth.module";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('the global module barrel MAY export the nest module', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/index.ts',
      code: 'export * from "./shell/auth.module";',
    }).toPassArchitectureLint();
  });

  it('the global module barrel may NOT export anything else', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/index.ts',
      code: 'export * from "./application";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('the index may NOT re-export infrastructure', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/index.ts',
      code: 'export * from "./auth/infrastructure";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('the module root MAY mount a common module', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/shell/__fixture__.ts',
      code: 'import { x } from "../../../common/modules";',
    }).toPassArchitectureLint();
  });

  it('the module root MAY mount a core module — the staff subject of two apps lives in core', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/shell/__fixture__.ts',
      code: 'import { x } from "../../../../../../core/modules/src/__identity-fixture__";',
    }).toPassArchitectureLint();
  });

  it('a core adapter MAY reach the core contracts and its own outbound', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/infrastructure/core-adapters/__fixture__.ts',
      code: 'import { x } from "../../../../../../../core/contracts/src/__identity-fixture__";\nimport { y } from "../../outbound";',
    }).toPassArchitectureLint();
  });

  it('a core adapter may NOT reach the core entities', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/infrastructure/core-adapters/__fixture__.ts',
      code: 'import { x } from "../../../../../../../core/entities/src";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('the module root MAY reach app contracts and its own infrastructure', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/shell/__fixture__.ts',
      code: 'import { x } from "../../../contracts/auth";\nimport { y } from "../infrastructure";',
    }).toPassArchitectureLint();
  });

  it('the module root may NOT import entities — it wires them through infrastructure', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/shell/__fixture__.ts',
      code: 'import { x } from "../../../../../../core/entities/src";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('the module root may NOT reach app contracts of another name', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/shell/__fixture__.ts',
      code: 'import { x } from "../../../contracts/audit";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('the module root may NOT reach core contracts', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/shell/__fixture__.ts',
      code: 'import { x } from "../../../../../../core/contracts/src/__identity-fixture__";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('the module root may NOT reach a feature', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/shell/__fixture__.ts',
      code: 'import { x } from "../../../features/product";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('infrastructure/common-adapters MAY reach the contracts of a common module and its own', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/infrastructure/common-adapters/__fixture__.ts',
      code: 'import { x } from "../../../../contracts/identity";\nimport { y } from "../../../../contracts/auth";',
    }).toPassArchitectureLint();
  });

  it('infrastructure/common-adapters MAY implement a port of its own outbound', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/infrastructure/common-adapters/__fixture__.ts',
      code: 'import { x } from "../../outbound";',
    }).toPassArchitectureLint();
  });

  it('infrastructure/common-adapters may NOT reach core contracts', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/infrastructure/common-adapters/__fixture__.ts',
      code: 'import { x } from "../../../../../../../core/contracts/src/__identity-fixture__";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('infrastructure/common-adapters MAY reach a sibling adapter of its own module', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/infrastructure/common-adapters/spec/__fixture__.ts',
      code: 'import { x } from "..";',
    }).toPassArchitectureLint();
  });

  it('infrastructure/common-adapters may NOT reach the core adapters of another module', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/audit/infrastructure/common-adapters/__fixture__.ts',
      code: 'import { x } from "../../../auth/infrastructure/common-adapters";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('infrastructure/common-adapters may NOT reach entities', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/infrastructure/common-adapters/__fixture__.ts',
      code: 'import { x } from "../../../../../../../core/entities/src";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('infrastructure/common-adapters may NOT mount a common module', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/infrastructure/common-adapters/__fixture__.ts',
      code: 'import { x } from "../../../../common/modules";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('infrastructure/lib-adapters MAY reach the contracts of a lib and implement a port of its own outbound', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/infrastructure/lib-adapters/__fixture__.ts',
      code: 'import { x } from "../../../../../../../libs/contracts/src/credentials";\nimport { y } from "../../outbound";',
    }).toPassArchitectureLint();
  });

  it.each([
    ['app contracts', '../../../../contracts/identity'],
    ['core contracts', '../../../../../../../core/contracts/src/__identity-fixture__'],
    ['entities', '../../../../../../../core/entities/src'],
  ])('infrastructure/lib-adapters may NOT reach %s', async (_case, source) => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/infrastructure/lib-adapters/__fixture__.ts',
      code: `import { x } from "${source}";`,
    }).toBreakRule('boundaries/dependencies');
  });

  it('the rest of infrastructure MAY reach entities, app contracts and its own adapters', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/infrastructure/persistence/__fixture__.ts',
      code: 'import { x } from "../../../../../../../core/entities/src";\nimport { y } from "../../../../contracts/auth";\nimport { z } from "../common-adapters";\nimport { w } from "../lib-adapters";',
    }).toPassArchitectureLint();
  });

  it('the rest of infrastructure may NOT reach core contracts', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/infrastructure/persistence/__fixture__.ts',
      code: 'import { x } from "../../../../../../../core/contracts/src/__identity-fixture__";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('the module root MAY reach its own application', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/shell/__fixture__.ts',
      code: 'import { x } from "../application";',
    }).toPassArchitectureLint();
  });

  it('the module root may NOT reach its own outbound — infrastructure binds the tokens', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/shell/__fixture__.ts',
      code: 'import { y } from "../outbound";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('application MAY reach its own outbound and @nestjs/common', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/application/use-cases/__fixture__.ts',
      code: 'import { x } from "../../outbound";\nimport { Inject } from "@nestjs/common";',
    }).toPassArchitectureLint();
  });

  it.each([
    '../../infrastructure',
    '../../../../../../../core/entities/src',
    'typeorm',
    '../../../../contracts/auth',
  ])('application may NOT reach %s', async (source) => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/application/use-cases/__fixture__.ts',
      code: `import { x } from "${source}";`,
    }).toBreakRule('boundaries/dependencies');
  });

  it.each(['../application', '@nestjs/common'])('outbound may NOT reach %s', async (source) => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/outbound/__fixture__.ts',
      code: `import { x } from "${source}";`,
    }).toBreakRule('boundaries/dependencies');
  });

  it.each(['typeorm', '@acme-libs/contracts/database'])(
    'the rest of infrastructure MAY import the persistence package %s',
    async (source) => {
      await expect({
        file: 'apps/__global-fixture__/src/global/auth/infrastructure/persistence/__fixture__.ts',
        code: `import { x } from "${source}";`,
      }).toPassArchitectureLint();
    },
  );

  it.each([
    '@acme-libs/database',
    '@nestjs-cls/transactional',
    '@nestjs-cls/transactional-adapter-typeorm',
  ])(
    'the rest of infrastructure may NOT import %s — a repository reads tables through ORM_PORT',
    async (source) => {
      await expect({
        file: 'apps/__global-fixture__/src/global/auth/infrastructure/persistence/__fixture__.ts',
        code: `import { x } from "${source}";`,
      }).toBreakRule('boundaries/dependencies');
    },
  );

  it('the rest of infrastructure may NOT import @nestjs/typeorm — the app setup registers the entities', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/infrastructure/persistence/__fixture__.ts',
      code: 'import { TypeOrmModule } from "@nestjs/typeorm";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('the rest of infrastructure MAY reach its own outbound', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/infrastructure/persistence/__fixture__.ts',
      code: 'import { x } from "../../outbound";',
    }).toPassArchitectureLint();
  });

  it('another global module may NOT reach auth infrastructure', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/audit/infrastructure/__fixture__.ts',
      code: 'import { x } from "../../auth/infrastructure";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('the shell MAY reach the auth lib contract, whatever the name of the module', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/session/shell/__fixture__.ts',
      code: 'import { x } from "../../../../../../libs/contracts/src/auth";',
    }).toPassArchitectureLint();
  });

  it.each([
    ['shell', 'cache', '../../../../../../libs/contracts/src/cache'],
    ['shell', 'credentials', '../../../../../../libs/contracts/src/credentials'],
    ['infrastructure/common-adapters', 'auth', '../../../../../../../libs/contracts/src/auth'],
    ['infrastructure/lib-adapters', 'cache', '../../../../../../../libs/contracts/src/cache'],
    ['infrastructure/lib-adapters', 'health', '../../../../../../../libs/contracts/src/health'],
  ])(
    'the %s of a global module may NOT reach the %s lib contract it does not use',
    async (layer, _lib, contracts) => {
      await expect({
        file: `apps/__global-fixture__/src/global/auth/${layer}/__fixture__.ts`,
        code: `import { x } from "${contracts}";`,
      }).toBreakRule('boundaries/dependencies');
    },
  );

  it('global persistence may NOT reach the cache contracts', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/global/auth/infrastructure/persistence/__fixture__.ts',
      code: 'import { x } from "../../../../../../../libs/contracts/src/cache";',
    }).toBreakRule('boundaries/dependencies');
  });

  it.each([
    'apps/__global-fixture__/src/global/auth/shell/__fixture__.ts',
    'apps/__global-fixture__/src/global/auth/infrastructure/common-adapters/__fixture__.ts',
  ])('%s MAY import @nestjs/common', async (file) => {
    await expect({
      file,
      code: 'import { Injectable } from "@nestjs/common";',
    }).toPassArchitectureLint();
  });

  it.each([
    'apps/__global-fixture__/src/global/auth/shell/__fixture__.ts',
    'apps/__global-fixture__/src/global/auth/infrastructure/common-adapters/__fixture__.ts',
  ])('%s may NOT import @nestjs/jwt — the auth lib verifies tokens', async (file) => {
    await expect({
      file,
      code: 'import { JwtService } from "@nestjs/jwt";',
    }).toBreakRule('boundaries/dependencies');
  });

  it('a feature may NOT reach the global modules', async () => {
    await expect({
      file: 'apps/__global-fixture__/src/features/product/shell/__fixture__.module.ts',
      code: 'import { x } from "../../../global";',
    }).toBreakRule('boundaries/dependencies');
  });
});
