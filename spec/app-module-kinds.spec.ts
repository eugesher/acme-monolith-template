import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import * as path from 'path';

import {
  appModules,
  moduleKindViolationOf,
  moduleKindViolations,
} from './support/app-module-kinds';

describe('feature kinds: an aggregator or a regular module, never both', () => {
  it('finds the modules of every app', () => {
    const relPaths = appModules().map(({ relPath }) => relPath);

    expect(relPaths).toEqual(
      expect.arrayContaining([
        'apps/staff-app/src/features/health',
        'apps/customer-app/src/features/health',
      ]),
    );
  });

  it('every feature is either an aggregator or a regular module', () => {
    const violations = moduleKindViolations();

    expect(violations).toEqual([]);
  });

  describe('the walk over nested modules', () => {
    let root: string;

    beforeAll(() => {
      root = mkdtempSync(path.join(tmpdir(), 'app-module-kinds-'));

      for (const file of [
        'apps/app/src/features/product/index.ts',
        'apps/app/src/features/product/shell/product.module.ts',
        'apps/app/src/features/product/shell/product.controller.ts',
        'apps/app/src/features/ledger/ledger.module.ts',
        'apps/app/src/features/ledger/modules/index.ts',
        'apps/app/src/features/ledger/modules/ledger-export/index.ts',
        'apps/app/src/features/ledger/modules/ledger-export/shell/ledger-export.module.ts',
        'apps/app/src/features/ledger/modules/ledger-export/modules/deeper/index.ts',
        'apps/app/src/processors/catalog-events/index.ts',
        'apps/app/src/processors/catalog-events/shell/catalog-events.module.ts',
        'apps/app/src/processors/catalog-events/shell/catalog-events.processor.ts',
        'apps/app/src/processors/purge/index.ts',
        'apps/app/src/processors/purge/shell/purge.module.ts',
        'apps/app/src/processors/purge/shell/purge.controller.ts',
        'apps/app/src/processors/digest/index.ts',
        'apps/app/src/processors/digest/shell/digest.module.ts',
        'apps/app/src/processors/digest/presentation/digest.processor.ts',
      ]) {
        mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
        writeFileSync(path.join(root, file), '');
      }
    });

    afterAll(() => {
      rmSync(root, { recursive: true, force: true });
    });

    it('goes exactly one level into modules/ of a top-level module, in features and processors', () => {
      expect(
        appModules(root)
          .map(({ relPath, area, nested }) => ({ relPath, area, nested }))
          .sort((a, b) => a.relPath.localeCompare(b.relPath)),
      ).toEqual([
        { relPath: 'apps/app/src/features/ledger', area: 'features', nested: false },
        {
          relPath: 'apps/app/src/features/ledger/modules/ledger-export',
          area: 'features',
          nested: true,
        },
        { relPath: 'apps/app/src/features/product', area: 'features', nested: false },
        { relPath: 'apps/app/src/processors/catalog-events', area: 'processors', nested: false },
        { relPath: 'apps/app/src/processors/digest', area: 'processors', nested: false },
        { relPath: 'apps/app/src/processors/purge', area: 'processors', nested: false },
      ]);
    });

    it('flags the submodule that aggregates modules of its own and the processors without a .processor.ts', () => {
      expect(
        appModules(root)
          .filter((module) => moduleKindViolationOf(module) !== null)
          .map(({ relPath }) => relPath)
          .sort(),
      ).toEqual([
        'apps/app/src/features/ledger/modules/ledger-export',
        'apps/app/src/processors/digest',
        'apps/app/src/processors/purge',
      ]);
    });
  });

  describe('the rule itself', () => {
    it.each([
      [
        'an aggregator',
        {
          relPath: 'x',
          name: 'x',
          area: 'features' as const,
          nested: false,
          files: ['x.module.ts'],
          folders: ['modules'],
          shellFiles: [],
        },
      ],
      [
        'a regular module',
        {
          relPath: 'x',
          name: 'x',
          area: 'features' as const,
          nested: false,
          files: ['index.ts'],
          folders: ['domain', 'application', 'presentation', 'shell'],
          shellFiles: ['x.module.ts', 'x.controller.ts'],
        },
      ],
      [
        'a regular submodule',
        {
          relPath: 'x',
          name: 'x',
          area: 'features' as const,
          nested: true,
          files: ['index.ts'],
          folders: ['presentation', 'shell'],
          shellFiles: ['x.module.ts', 'x.controller.ts'],
        },
      ],
      [
        'a regular processor',
        {
          relPath: 'x',
          name: 'x',
          area: 'processors' as const,
          nested: false,
          files: ['index.ts'],
          folders: ['application', 'shell'],
          shellFiles: ['x.module.ts', 'x.processor.ts'],
        },
      ],
      [
        'a processor with the queue of its module in queues/',
        {
          relPath: 'x',
          name: 'x',
          area: 'processors' as const,
          nested: false,
          files: ['index.ts'],
          folders: ['application', 'queues', 'shell'],
          shellFiles: ['x.module.ts', 'x.processor.ts'],
        },
      ],
    ])('accepts %s', (_, module) => {
      expect(moduleKindViolationOf(module)).toBeNull();
    });

    it.each([
      [
        'an aggregator with a layer',
        {
          relPath: 'x',
          name: 'x',
          area: 'features' as const,
          nested: false,
          files: ['x.module.ts'],
          folders: ['modules', 'domain'],
          shellFiles: [],
        },
      ],
      [
        'an aggregator with an extra file',
        {
          relPath: 'x',
          name: 'x',
          area: 'features' as const,
          nested: false,
          files: ['x.module.ts', 'x.service.ts'],
          folders: ['modules'],
          shellFiles: [],
        },
      ],
      [
        'an aggregator without its nest module',
        {
          relPath: 'x',
          name: 'x',
          area: 'features' as const,
          nested: false,
          files: ['index.ts'],
          folders: ['modules'],
          shellFiles: [],
        },
      ],
      [
        'a regular module with a non-layer folder',
        {
          relPath: 'x',
          name: 'x',
          area: 'features' as const,
          nested: false,
          files: ['index.ts'],
          folders: ['domain', 'utils', 'shell'],
          shellFiles: ['x.module.ts', 'x.controller.ts'],
        },
      ],
      [
        'a regular module with an extra file',
        {
          relPath: 'x',
          name: 'x',
          area: 'features' as const,
          nested: false,
          files: ['index.ts', 'helpers.ts'],
          folders: ['domain', 'shell'],
          shellFiles: ['x.module.ts', 'x.controller.ts'],
        },
      ],
      [
        'a regular module with its nest module at the root',
        {
          relPath: 'x',
          name: 'x',
          area: 'features' as const,
          nested: false,
          files: ['x.module.ts'],
          folders: ['domain', 'shell'],
          shellFiles: ['x.controller.ts'],
        },
      ],
      [
        'a submodule that aggregates',
        {
          relPath: 'x',
          name: 'x',
          area: 'features' as const,
          nested: true,
          files: ['x.module.ts'],
          folders: ['modules'],
          shellFiles: [],
        },
      ],
      [
        'a module without its nest module',
        {
          relPath: 'x',
          name: 'x',
          area: 'features' as const,
          nested: false,
          files: ['index.ts'],
          folders: ['domain', 'shell'],
          shellFiles: ['y.module.ts', 'x.controller.ts'],
        },
      ],
      [
        'a module without a barrel',
        {
          relPath: 'x',
          name: 'x',
          area: 'features' as const,
          nested: false,
          files: [],
          folders: ['domain', 'shell'],
          shellFiles: ['x.module.ts', 'x.controller.ts'],
        },
      ],
      [
        'a module with no layers yet',
        {
          relPath: 'x',
          name: 'x',
          area: 'features' as const,
          nested: false,
          files: ['index.ts'],
          folders: [],
          shellFiles: [],
        },
      ],
      [
        'a regular module without a controller',
        {
          relPath: 'x',
          name: 'x',
          area: 'features' as const,
          nested: false,
          files: ['index.ts'],
          folders: ['domain', 'application', 'presentation', 'shell'],
          shellFiles: ['x.module.ts'],
        },
      ],
      [
        'a processor without a .processor.ts',
        {
          relPath: 'x',
          name: 'x',
          area: 'processors' as const,
          nested: false,
          files: ['index.ts'],
          folders: ['application', 'shell'],
          shellFiles: ['x.module.ts'],
        },
      ],
      [
        'a feature with a queues folder',
        {
          relPath: 'x',
          name: 'x',
          area: 'features' as const,
          nested: false,
          files: ['index.ts'],
          folders: ['queues', 'shell'],
          shellFiles: ['x.module.ts', 'x.controller.ts'],
        },
      ],
      [
        'a processor with a presentation folder',
        {
          relPath: 'x',
          name: 'x',
          area: 'processors' as const,
          nested: false,
          files: ['index.ts'],
          folders: ['application', 'presentation', 'shell'],
          shellFiles: ['x.module.ts', 'x.processor.ts'],
        },
      ],
    ])('rejects %s', (_, module) => {
      expect(moduleKindViolationOf(module)).not.toBeNull();
    });
  });
});
