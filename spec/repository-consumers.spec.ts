import { repositoryConsumers, repositoryConsumerViolations } from './support/repository-consumers';

describe('one repository per case, service or facade', () => {
  it('finds the consumers of every area', () => {
    const names = repositoryConsumers().map(({ name }) => name);

    expect(names).toEqual(
      expect.arrayContaining([
        'UserReassignRolesCase',
        'AuthCommonFindSubjectCase',
        'IdempotencyPurgeProcessCase',
        'IdempotencyCoreClaimCase',
      ]),
    );
  });

  it('every consumer keeps at most one repository of its own in "repository"', () => {
    expect(repositoryConsumerViolations(repositoryConsumers())).toEqual([]);
  });

  describe('the rule itself', () => {
    it.each([
      [
        'a case with its own repository port',
        [
          {
            name: 'ProductGetHistoryCase',
            file: 'x',
            params: [{ name: 'repository', type: 'IProductGetHistoryRepositoryPort' }],
          },
        ],
      ],
      [
        'a service with its own repository port',
        [
          {
            name: 'ProductPricingService',
            file: 'x',
            params: [{ name: 'repository', type: 'IProductPricingRepositoryPort' }],
          },
        ],
      ],
      [
        'a global facade with its own repository class',
        [
          {
            name: 'SessionFacade',
            file: 'x',
            params: [{ name: 'repository', type: 'SessionRepository' }],
          },
        ],
      ],
      [
        'two apps with a namesake repository port each',
        [
          {
            name: 'AuthLoginCase',
            file: 'apps/staff-app/src/features/auth/application/cases/auth-login.case.ts',
            params: [{ name: 'repository', type: 'IAuthLoginRepositoryPort' }],
          },
          {
            name: 'AuthLoginCase',
            file: 'apps/customer-app/src/features/auth/application/cases/auth-login.case.ts',
            params: [{ name: 'repository', type: 'IAuthLoginRepositoryPort' }],
          },
        ],
      ],
    ])('accepts %s', (_, consumers) => {
      expect(repositoryConsumerViolations(consumers)).toEqual([]);
    });

    it.each([
      [
        'two repositories',
        [
          {
            name: 'ProductGetHistoryCase',
            file: 'x',
            params: [
              { name: 'repository', type: 'IProductGetHistoryRepositoryPort' },
              { name: 'other', type: 'IProductListArchivedRepositoryPort' },
            ],
          },
        ],
      ],
      [
        'a repository kept under another name',
        [
          {
            name: 'ProductGetHistoryCase',
            file: 'x',
            params: [{ name: 'categories', type: 'IProductGetHistoryRepositoryPort' }],
          },
        ],
      ],
      [
        'the repository of another consumer',
        [
          {
            name: 'ProductGetHistoryCase',
            file: 'x',
            params: [{ name: 'repository', type: 'IProductListArchivedRepositoryPort' }],
          },
        ],
      ],
      [
        'the get-many and get-one cases sharing one repository',
        [
          {
            name: 'ProductGetManyCase',
            file: 'x',
            params: [{ name: 'repository', type: 'IProductGetManyRepositoryPort' }],
          },
          {
            name: 'ProductGetOneCase',
            file: 'x',
            params: [{ name: 'repository', type: 'IProductGetManyRepositoryPort' }],
          },
        ],
      ],
      [
        'a CRUD repository shared by the cases of its resource',
        [
          {
            name: 'ProductGetManyCase',
            file: 'x',
            params: [{ name: 'repository', type: 'IProductCrudRepositoryPort' }],
          },
          {
            name: 'ProductDeleteOneCase',
            file: 'x',
            params: [{ name: 'repository', type: 'IProductCrudRepositoryPort' }],
          },
        ],
      ],
    ])('rejects %s', (_, consumers) => {
      expect(repositoryConsumerViolations(consumers)).not.toEqual([]);
    });
  });
});
