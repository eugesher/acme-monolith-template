import {
  e2eFilesOf,
  endpointViolations,
  repositoryEndpoints,
  repositorySources,
  routeHandlersOf,
} from './support/e2e-endpoints';

describe('e2e endpoints', () => {
  it('finds the route handlers of every controller', () => {
    const endpoints = repositoryEndpoints();

    expect(endpoints).toEqual(
      expect.arrayContaining([
        {
          controller: 'apps/staff-app/src/features/tools/modules/tag/shell/tag.controller.ts',
          handler: 'handleRename',
        },
        {
          controller: 'apps/customer-app/src/features/order/shell/order.controller.ts',
          handler: 'handlePlace',
        },
        {
          controller: 'apps/processor-app/src/features/health/shell/health.controller.ts',
          handler: 'handleLiveness',
        },
      ]),
    );
  });

  it('every route handler has a case in the e2e class of its module, and the suite runs it', () => {
    expect(endpointViolations(repositoryEndpoints(), repositorySources)).toEqual([]);
  });

  describe('the rule itself', () => {
    it('takes the decorated methods of a controller as its route handlers', () => {
      const handlers = routeHandlersOf(
        'item.controller.ts',
        'class ItemController { @Get() handleList() {} @Post() handleCreate() {} private map() {} }',
      );

      expect(handlers).toEqual(['handleList', 'handleCreate']);
    });

    it.each([
      [
        'a feature',
        'apps/x/src/features/item/shell/item.controller.ts',
        'apps/x/test/features/item/item.e2e.ts',
      ],
      [
        'a submodule of a feature group',
        'apps/x/src/features/stock/modules/item/shell/item.controller.ts',
        'apps/x/test/features/stock/modules/item.e2e.ts',
      ],
    ])('mirrors the path of %s into the test of its app', (_case, controller, e2eFile) => {
      expect(e2eFilesOf(controller)).toEqual([e2eFile, 'libs/testing/src/e2e/item.e2e.ts']);
    });

    it.each([
      [
        'no e2e class',
        {},
        'apps/x/src/features/item/shell/item.controller.ts has no apps/x/test/features/item/item.e2e.ts or libs/testing/src/e2e/item.e2e.ts',
      ],
      [
        'no method for the endpoint',
        {
          'apps/x/test/features/item/item.e2e.ts':
            'export class ItemE2E { public handleList(): void {} }',
        },
        'ItemE2E of apps/x/test/features/item/item.e2e.ts has no handleCreate, the endpoint of apps/x/src/features/item/shell/item.controller.ts',
      ],
      [
        'a method without a case',
        {
          'apps/x/test/features/item/item.e2e.ts':
            'export class ItemE2E { public handleCreate(): void { describe("POST /api/items", () => {}); } }',
        },
        'ItemE2E.handleCreate has no case',
      ],
      [
        'a method the suite never runs',
        {
          'apps/x/test/features/item/item.e2e.ts':
            'export class ItemE2E { public handleCreate(): void { it("creates", () => {}); } }',
          'apps/x/test/app/app.e2e-spec.ts':
            'const itemE2E = ItemE2E.of(ctx); itemE2E.handleList();',
        },
        'ItemE2E.handleCreate is never run by the suite of x',
      ],
    ])('rejects %s', (_case, files: Record<string, string>, violation) => {
      const violations = endpointViolations(
        [
          {
            controller: 'apps/x/src/features/item/shell/item.controller.ts',
            handler: 'handleCreate',
          },
        ],
        {
          read: (file) => (file in files ? files[file] : null),
          testFiles: () => Object.keys(files),
        },
      );

      expect(violations).toEqual([violation]);
    });

    it.each([
      ['a section of the app', 'apps/x/test/features/item/item.e2e.ts'],
      ['a section shared by every app', 'libs/testing/src/e2e/item.e2e.ts'],
    ])('accepts an endpoint run from %s', (_case, e2eFile) => {
      const files: Record<string, string> = {
        [e2eFile]:
          'export class ItemE2E { public handleCreate(): void { it.each([1])("creates %s", () => {}); } }',
        'apps/x/test/app/app.e2e-spec.ts':
          'const itemE2E = ItemE2E.of(ctx); itemE2E.handleCreate();',
      };

      const violations = endpointViolations(
        [
          {
            controller: 'apps/x/src/features/item/shell/item.controller.ts',
            handler: 'handleCreate',
          },
        ],
        {
          read: (file) => (file in files ? files[file] : null),
          testFiles: () => Object.keys(files),
        },
      );

      expect(violations).toEqual([]);
    });
  });
});
