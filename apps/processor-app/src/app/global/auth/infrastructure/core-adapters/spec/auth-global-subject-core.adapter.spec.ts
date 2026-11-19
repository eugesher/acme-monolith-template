import { AuthGlobalSubjectCoreAdapter } from '../auth-global-subject-core.adapter';

describe('AuthGlobalSubjectCoreAdapter', () => {
  let handleFindSubject: jest.Mock;
  let adapter: AuthGlobalSubjectCoreAdapter;

  beforeEach(() => {
    handleFindSubject = jest.fn();
    adapter = new AuthGlobalSubjectCoreAdapter({ handleFindSubject });
  });

  describe('findSubject', () => {
    it('answers the id, the email and the permission codes of the subject the core finds', async () => {
      handleFindSubject.mockResolvedValue({
        id: 'user-1',
        email: 'ann@example.com',
        roles: ['admin'],
        permissionCodes: ['ledger:read'],
      });

      const subject = await adapter.findSubject({ userId: 'user-1' });

      expect(subject).toEqual({
        id: 'user-1',
        email: 'ann@example.com',
        permissionCodes: ['ledger:read'],
      });
      expect(handleFindSubject).toHaveBeenCalledWith({ userId: 'user-1' });
    });

    it('answers no subject when the core finds no active staff user', async () => {
      handleFindSubject.mockResolvedValue(null);

      const subject = await adapter.findSubject({ userId: 'user-1' });

      expect(subject).toBeNull();
    });
  });
});
