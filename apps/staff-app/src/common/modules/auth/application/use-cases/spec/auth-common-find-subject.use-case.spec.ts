import { PermissionCodeEnum } from '@acme-libs/kernel';

import { AuthCommonFindSubjectUseCase } from '../auth-common-find-subject.use-case';
import type { IAuthCommonFindSubjectRepositoryPort } from '../../../outbound';

describe('AuthCommonFindSubjectUseCase', () => {
  let repository: jest.Mocked<IAuthCommonFindSubjectRepositoryPort>;
  let useCase: AuthCommonFindSubjectUseCase;

  beforeEach(() => {
    repository = { findActiveOne: jest.fn() };
    repository.findActiveOne.mockResolvedValue({
      id: 'user-1',
      email: 'editor@example.com',
      userRoles: [
        { role: { name: 'editor', rolePermissions: [{ code: PermissionCodeEnum.LEDGER_READ }] } },
      ],
    });
    useCase = new AuthCommonFindSubjectUseCase(repository);
  });

  describe('execute', () => {
    it('answers the active user with its roles and permission codes', async () => {
      const subject = await useCase.execute({ userId: 'user-1' });

      expect(subject).toEqual({
        id: 'user-1',
        email: 'editor@example.com',
        roles: ['editor'],
        permissionCodes: ['ledger:read'],
      });
      expect(repository.findActiveOne).toHaveBeenCalledWith('user-1');
    });

    it('answers null when no active user matches', async () => {
      repository.findActiveOne.mockResolvedValue(null);

      const subject = await useCase.execute({ userId: 'ghost' });

      expect(subject).toBeNull();
    });
  });
});
