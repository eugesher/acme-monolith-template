import {
  existsInRepository,
  missingSpecs,
  requiredSpecSubjects,
  specFiles,
  unwantedSpecs,
} from './support/required-specs';

describe('specs the coverage cannot ask for', () => {
  it('finds the lib modules and the request, query and param DTOs that declare validation', () => {
    const subjects = requiredSpecSubjects();

    expect(subjects).toEqual(
      expect.arrayContaining([
        'libs/database/src/orm/shell/orm.module.ts',
        'libs/cache/src/shell/cache.module.ts',
        'apps/staff-app/src/features/tools/modules/tag/presentation/dto/requests/tag-rename.request.dto.ts',
        'apps/staff-app/src/features/access/modules/role/presentation/dto/params/role-id.param.dto.ts',
        'apps/staff-app/src/features/queue/presentation/dto/params/queue-job.param.dto.ts',
        'libs/http/src/pagination/page.query.dto.ts',
      ]),
    );
    expect(subjects).not.toContain(
      'apps/staff-app/src/features/tools/modules/tag/presentation/dto/queries/tag-get-many.query.dto.ts',
    );
    expect(subjects).not.toContain(
      'apps/staff-app/src/features/tools/modules/tag/shell/tag.controller.ts',
    );
    expect(subjects).not.toContain(
      'apps/staff-app/src/features/tools/modules/tag/shell/tag.module.ts',
    );
    expect(subjects).not.toContain('libs/queue/src/bull/bull-setup.module.ts');
  });

  it('every lib module and every request, query and param DTO with validation has a spec next to it', () => {
    expect(missingSpecs(requiredSpecSubjects(), existsInRepository)).toEqual([]);
  });

  it('no controller and no facade has a spec, the e2e suites run them', () => {
    expect(unwantedSpecs(specFiles())).toEqual([]);
  });

  describe('the rule itself', () => {
    it('accepts a subject with its spec in the spec folder next to it', () => {
      const violations = missingSpecs(
        ['libs/x/src/shell/x.module.ts'],
        (file) => file === 'libs/x/src/shell/spec/x.module.spec.ts',
      );

      expect(violations).toEqual([]);
    });

    it.each([
      ['no spec at all', []],
      [
        'a spec beside the subject',
        ['apps/x/src/features/item/presentation/dto/item-id.param.dto.spec.ts'],
      ],
      [
        'a spec of another name',
        ['apps/x/src/features/item/presentation/dto/spec/item.param.dto.spec.ts'],
      ],
    ])('rejects %s', (_, files: string[]) => {
      const violations = missingSpecs(
        ['apps/x/src/features/item/presentation/dto/item-id.param.dto.ts'],
        (file) => files.includes(file),
      );

      expect(violations).toEqual([
        'apps/x/src/features/item/presentation/dto/item-id.param.dto.ts has no apps/x/src/features/item/presentation/dto/spec/item-id.param.dto.spec.ts',
      ]);
    });

    it('rejects the spec of a controller and of a facade and keeps the rest of shell/', () => {
      const unwanted = unwantedSpecs([
        'apps/x/src/features/item/shell/spec/item.controller.spec.ts',
        'core/modules/src/item/shell/spec/item-core.facade.spec.ts',
        'apps/x/src/processors/item/shell/spec/item.processor.spec.ts',
        'libs/x/src/shell/spec/x.module.spec.ts',
        'apps/x/src/features/item/application/use-cases/spec/item-create.use-case.spec.ts',
      ]);

      expect(unwanted).toEqual([
        'apps/x/src/features/item/shell/spec/item.controller.spec.ts',
        'core/modules/src/item/shell/spec/item-core.facade.spec.ts',
      ]);
    });
  });
});
