import '../support/lint';
import { Scaffold } from '../support/scaffold';

describe('app → core', () => {
  let scaffold: Scaffold;

  beforeAll(() => {
    scaffold = Scaffold.create([
      'apps/__core-link-fixture__/src/global/index.ts',
      'apps/__core-link-fixture__/src/features/product/index.ts',
      'core/modules/src/__ledger-fixture__/index.ts',
      'core/modules/src/__ledger-fixture__/application/index.ts',
      'core/contracts/src/__ledger-fixture__/index.ts',
      'core/entities/src/index.ts',
      'libs/contracts/src/health/index.ts',
    ]);
  });

  afterAll(() => {
    scaffold.remove();
  });

  describe('features', () => {
    it('infrastructure/core-adapters MAY reach core contracts', async () => {
      await expect({
        file: 'apps/__core-link-fixture__/src/features/product/infrastructure/core-adapters/__fixture__.ts',
        code: 'import { x } from "../../../../../../../core/contracts/src/__ledger-fixture__";',
      }).toPassArchitectureLint();
    });

    it.each([
      [
        'apps/__core-link-fixture__/src/features/product/infrastructure/persistence/__fixture__.ts',
        '../../../../../../../core/contracts/src/__ledger-fixture__',
      ],
      [
        'apps/__core-link-fixture__/src/features/product/application/cases/__fixture__.ts',
        '../../../../../../../core/contracts/src/__ledger-fixture__',
      ],
      [
        'apps/__core-link-fixture__/src/features/product/shell/__fixture__.controller.ts',
        '../../../../../../core/contracts/src/__ledger-fixture__',
      ],
    ])('%s may NOT reach core contracts — only core-adapters do', async (file, source) => {
      await expect({ file, code: `import { x } from "${source}";` }).toBreakRule(
        'boundaries/dependencies',
      );
    });

    it('infrastructure/core-adapters may NOT reach entities — it talks to the core module, not its tables', async () => {
      await expect({
        file: 'apps/__core-link-fixture__/src/features/product/infrastructure/core-adapters/__fixture__.ts',
        code: 'import { x } from "../../../../../../../core/entities/src";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('presentation may NOT reach the health lib contracts — a lib adapter does', async () => {
      await expect({
        file: 'apps/__core-link-fixture__/src/features/product/shell/__fixture__.controller.ts',
        code: 'import { x } from "../../../../../../libs/contracts/src/health";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('the module root MAY mount a core module', async () => {
      await expect({
        file: 'apps/__core-link-fixture__/src/features/product/shell/__fixture__.module.ts',
        code: 'import { x } from "../../../../../../core/modules/src/__ledger-fixture__";',
      }).toPassArchitectureLint();
    });

    it('infrastructure/core-adapters may NOT mount a core module', async () => {
      await expect({
        file: 'apps/__core-link-fixture__/src/features/product/infrastructure/core-adapters/__fixture__.ts',
        code: 'import { x } from "../../../../../../../core/modules/src/__ledger-fixture__";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('infrastructure MAY reach entities', async () => {
      await expect({
        file: 'apps/__core-link-fixture__/src/features/product/infrastructure/persistence/__fixture__.ts',
        code: 'import { x } from "../../../../../../../core/entities/src";',
      }).toPassArchitectureLint();
    });

    it('an app may NOT take a deep path into a core module', async () => {
      await expect({
        file: 'apps/__core-link-fixture__/src/features/product/shell/__fixture__.module.ts',
        code: 'import { x } from "../../../../../../core/modules/src/__ledger-fixture__/application";',
      }).toBreakRule('boundaries/dependencies');
    });
  });

  describe('bootstrap', () => {
    it('bootstrap may NOT mount a core module', async () => {
      await expect({
        file: 'apps/__core-link-fixture__/src/app/shell/app.module.ts',
        code: 'import { x } from "../../../../../core/modules/src/__ledger-fixture__";',
      }).toBreakRule('boundaries/dependencies');
    });

    it('the entity list of the app setup MAY reach the core entities', async () => {
      await expect({
        file: 'apps/__core-link-fixture__/src/app/setup/entities/index.ts',
        code: 'import { x } from "../../../../../../core/entities/src";',
      }).toPassArchitectureLint();
    });

    it('the rest of app/ may NOT reach the core entities, only the entity list does', async () => {
      await expect({
        file: 'apps/__core-link-fixture__/src/app/setup/config/__fixture__.ts',
        code: 'import { x } from "../../../../../../core/entities/src";',
      }).toBreakRule('boundaries/dependencies');
    });
  });
});
