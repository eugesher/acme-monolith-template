import { existsInRepository, missingSpecs, requiredSpecSubjects } from './support/required-specs';

describe('specs the coverage cannot ask for', () => {
  it('finds the controllers and the request, query and param DTOs that declare validation', () => {
    const subjects = requiredSpecSubjects();

    expect(subjects).toEqual(
      expect.arrayContaining([
        'apps/staff-app/src/features/tools/modules/tag/presentation/controllers/tag.controller.ts',
        'apps/staff-app/src/features/tools/modules/tag/presentation/dto/requests/tag-rename.request.dto.ts',
        'apps/staff-app/src/features/access/modules/role/presentation/dto/params/role-id.param.dto.ts',
        'apps/staff-app/src/features/queue/presentation/dto/params/queue-job.param.dto.ts',
        'libs/http/src/pagination/page.query.dto.ts',
      ]),
    );
    expect(subjects).not.toContain(
      'apps/staff-app/src/features/tools/modules/tag/presentation/dto/queries/tag-get-many.query.dto.ts',
    );
  });

  it('every controller and every request, query and param DTO with validation has a spec next to it', () => {
    expect(missingSpecs(requiredSpecSubjects(), existsInRepository)).toEqual([]);
  });

  describe('the rule itself', () => {
    it('accepts a subject with its spec in the spec folder next to it', () => {
      const violations = missingSpecs(
        ['apps/x/src/features/item/presentation/controllers/item.controller.ts'],
        (file) =>
          file === 'apps/x/src/features/item/presentation/controllers/spec/item.controller.spec.ts',
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
  });
});
