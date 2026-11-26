import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import * as path from 'path';

import { appPermissionUses, permissionModuleViolations } from './support/auth-permission-module';

describe('an app that requires a permission mounts AuthPermissionModule', () => {
  it('finds an app with a route that requires a permission', () => {
    const requiring = appPermissionUses().filter(({ requiring }) => requiring.length > 0);

    expect(requiring).not.toEqual([]);
  });

  it('every app with RequiresPermission imports AuthPermissionModule', () => {
    const violations = permissionModuleViolations(appPermissionUses());

    expect(violations).toEqual([]);
  });

  describe('the walk over the apps', () => {
    let root: string;

    beforeAll(() => {
      root = mkdtempSync(path.join(tmpdir(), 'auth-permission-module-'));

      for (const [file, code] of [
        [
          'apps/guarded/src/features/x/shell/x.controller.ts',
          'import { CurrentUser, RequiresPermission } from "@acme-libs/auth";',
        ],
        [
          'apps/guarded/src/global/auth/shell/auth-global.module.ts',
          'import { AuthJwtModule, AuthPermissionModule } from "@acme-libs/auth";',
        ],
        [
          'apps/guarded/src/features/x/shell/spec/x.controller.spec.ts',
          'import { AuthPermissionModule } from "@acme-libs/auth";',
        ],
        [
          'apps/aliased/src/features/x/shell/x.controller.ts',
          'import { RequiresPermission as Requires } from "@acme-libs/auth";',
        ],
        [
          'apps/aliased/src/features/x/shell/y.controller.ts',
          'import { RequiresPermission } from "@acme-libs/other";\nimport * as auth from "@acme-libs/auth";\nimport "@acme-libs/auth";',
        ],
        ['apps/aliased/src/features/x/x.module.ts', 'export class XModule {}'],
        [
          'apps/aliased/test/context/auth.ts',
          'import { AuthPermissionModule } from "@acme-libs/auth";',
        ],
        ['apps/empty/README.md', ''],
      ]) {
        mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
        writeFileSync(path.join(root, file), code);
      }
    });

    afterAll(() => {
      rmSync(root, { recursive: true, force: true });
    });

    it('reads the named imports of the auth lib in src, by their exported name, past specs and tests', () => {
      expect(appPermissionUses(root).sort((a, b) => a.app.localeCompare(b.app))).toEqual([
        {
          app: 'aliased',
          requiring: ['apps/aliased/src/features/x/shell/x.controller.ts'],
          mounting: [],
        },
        {
          app: 'guarded',
          requiring: ['apps/guarded/src/features/x/shell/x.controller.ts'],
          mounting: ['apps/guarded/src/global/auth/shell/auth-global.module.ts'],
        },
      ]);
    });
  });

  describe('the rule itself', () => {
    it.each([
      [
        'an app that requires a permission and mounts the module',
        { requiring: ['x'], mounting: ['y'] },
      ],
      ['an app without a permission route', { requiring: [], mounting: [] }],
      [
        'an app that mounts the module without a permission route',
        { requiring: [], mounting: ['y'] },
      ],
    ])('accepts %s', (_, use) => {
      expect(permissionModuleViolations([{ app: 'x', ...use }])).toEqual([]);
    });

    it('rejects an app that requires a permission without the module, naming its files', () => {
      expect(
        permissionModuleViolations([{ app: 'x', requiring: ['a.ts', 'b.ts'], mounting: [] }]),
      ).toEqual([
        {
          app: 'x',
          violation:
            'RequiresPermission is ignored without AuthPermissionModule, which no file of the app imports: a.ts, b.ts',
        },
      ]);
    });
  });
});
