import { AuthBaseException } from '../../../domain';
import { AuthMeUseCase } from '../auth-me.use-case';
import type { IAuthIdentityPort } from '../../../outbound';

describe('AuthMeUseCase', () => {
  let identity: jest.Mocked<IAuthIdentityPort>;
  let useCase: AuthMeUseCase;

  beforeEach(() => {
    identity = { findSubject: jest.fn() };
    useCase = new AuthMeUseCase(identity);
  });

  describe('execute', () => {
    it('answers the id, the email and the roles identity reads for the user', async () => {
      identity.findSubject.mockResolvedValue({
        id: 'user-1',
        email: 'ann@example.com',
        roles: ['admin'],
      });

      const me = await useCase.execute({ userId: 'user-1' });

      expect(me).toEqual({ id: 'user-1', email: 'ann@example.com', roles: ['admin'] });
      expect(identity.findSubject).toHaveBeenCalledWith({ userId: 'user-1' });
    });

    it('refuses with AUTH_USER_NOT_FOUND when identity no longer knows an active user', async () => {
      identity.findSubject.mockResolvedValue(null);

      const execution = useCase.execute({ userId: 'user-1' });

      await expect(execution).rejects.toBeInstanceOf(AuthBaseException);
      await expect(execution).rejects.toMatchObject({
        code: 'AUTH_USER_NOT_FOUND',
        message: 'User user-1 was not found',
      });
    });
  });
});
