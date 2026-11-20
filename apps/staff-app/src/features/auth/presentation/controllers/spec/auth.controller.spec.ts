import { AuthMeUseCase, type AuthLoginUseCase } from '../../../application';
import { AuthController } from '../auth.controller';

describe('AuthController', () => {
  let login: jest.Mocked<Pick<AuthLoginUseCase, 'execute'>>;
  let identity: jest.Mocked<ConstructorParameters<typeof AuthMeUseCase>[0]>;
  let controller: AuthController;

  beforeEach(() => {
    login = { execute: jest.fn() };
    identity = { findSubject: jest.fn() };
    controller = new AuthController(
      login as unknown as AuthLoginUseCase,
      new AuthMeUseCase(identity),
    );
  });

  describe('handleLogin', () => {
    it('answers the access token of the login use case', async () => {
      login.execute.mockResolvedValue({ accessToken: 'access-1' });

      const response = await controller.handleLogin({
        email: 'ann@example.com',
        password: 'secret',
      });

      expect(response).toEqual({ accessToken: 'access-1' });
      expect(login.execute).toHaveBeenCalledWith({ email: 'ann@example.com', password: 'secret' });
    });
  });

  describe('handleMe', () => {
    it('answers the current user with the roles identity reads for them', async () => {
      identity.findSubject.mockResolvedValue({
        id: 'user-1',
        email: 'ann@example.com',
        roles: ['admin'],
      });

      const response = await controller.handleMe({ id: 'user-1', email: 'ann@example.com' });

      expect(response).toEqual({ id: 'user-1', email: 'ann@example.com', roles: ['admin'] });
      expect(identity.findSubject).toHaveBeenCalledWith({ userId: 'user-1' });
    });
  });
});
