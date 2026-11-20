import { PermissionCodeEnum } from '@acme-libs/kernel';

import { StaffAuthCommonFindSubjectUseCase } from '../staff-auth-common-find-subject.use-case';
import type { IStaffAuthCommonFindSubjectRepositoryPort } from '../../../outbound';

describe('StaffAuthCommonFindSubjectUseCase', () => {
  let repository: jest.Mocked<IStaffAuthCommonFindSubjectRepositoryPort>;
  let useCase: StaffAuthCommonFindSubjectUseCase;

  beforeEach(() => {
    repository = { findActiveById: jest.fn() };
    repository.findActiveById.mockResolvedValue({
      id: 'user-1',
      email: 'editor@example.com',
      userRoles: [
        { role: { name: 'editor', rolePermissions: [{ code: PermissionCodeEnum.LEDGER_READ }] } },
      ],
    });
    useCase = new StaffAuthCommonFindSubjectUseCase(repository);
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
      expect(repository.findActiveById).toHaveBeenCalledWith('user-1');
    });

    it('answers null when no active user matches', async () => {
      repository.findActiveById.mockResolvedValue(null);

      const subject = await useCase.execute({ userId: 'ghost' });

      expect(subject).toBeNull();
    });
  });
});
