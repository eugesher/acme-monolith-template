import { IdentityExceptionCodeEnum, UserStatusEnum } from '@acme-libs/kernel';
import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { AuthLoginCase } from '../auth-login.case';
import type { IAuthCredentialsPort, IAuthLoginRepositoryPort } from '../../../outbound';

describe('AuthLoginCase', () => {
  let repository: jest.Mocked<IAuthLoginRepositoryPort>;
  let credentials: jest.Mocked<IAuthCredentialsPort>;
  let logger: PinoLoggerMock;
  let loginCase: AuthLoginCase;

  beforeEach(() => {
    repository = { findByEmail: jest.fn() };
    repository.findByEmail.mockResolvedValue({
      id: 'user-1',
      passwordHash: 'hash',
      status: UserStatusEnum.ACTIVE,
    });
    credentials = { issueAccessToken: jest.fn(), verifyPassword: jest.fn() };
    credentials.issueAccessToken.mockResolvedValue('access-token');
    credentials.verifyPassword.mockResolvedValue(true);
    logger = makePinoLoggerMock();
    loginCase = new AuthLoginCase(repository, credentials, logger);
  });

  describe('execute', () => {
    it('answers the access token of the right password', async () => {
      const view = await loginCase.execute({
        email: ' Editor@Example.com ',
        password: 'correct-horse',
      });

      expect(view).toEqual({ accessToken: 'access-token' });
      expect(repository.findByEmail).toHaveBeenCalledWith('editor@example.com');
      expect(credentials.verifyPassword).toHaveBeenCalledWith({
        passwordHash: 'hash',
        password: 'correct-horse',
      });
      expect(credentials.issueAccessToken).toHaveBeenCalledWith('user-1');
      expect(logger.info).toHaveBeenCalledWith({ id: 'user-1' }, 'User logged in');
    });

    it('refuses an unknown email after the same password check and as a wrong password', async () => {
      repository.findByEmail.mockResolvedValue(null);

      const execution = loginCase.execute({
        email: 'ghost@example.com',
        password: 'correct-horse',
      });

      await expect(execution).rejects.toMatchObject({
        code: IdentityExceptionCodeEnum.AUTH_INVALID_CREDENTIALS,
        message: 'Invalid credentials',
      });
      expect(credentials.verifyPassword).toHaveBeenCalledWith({
        passwordHash: null,
        password: 'correct-horse',
      });
      expect(logger.warn).toHaveBeenCalledWith('Login failed: unknown email');
    });

    it('refuses a wrong password', async () => {
      credentials.verifyPassword.mockResolvedValue(false);

      const execution = loginCase.execute({ email: 'editor@example.com', password: 'wrong-horse' });

      await expect(execution).rejects.toMatchObject({
        code: IdentityExceptionCodeEnum.AUTH_INVALID_CREDENTIALS,
      });
      expect(credentials.issueAccessToken).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(
        { userId: 'user-1' },
        'Login failed: wrong password',
      );
    });

    it('refuses a disabled user with its id after checking the password', async () => {
      repository.findByEmail.mockResolvedValue({
        id: 'user-1',
        passwordHash: 'hash',
        status: UserStatusEnum.DISABLED,
      });

      const execution = loginCase.execute({
        email: 'editor@example.com',
        password: 'correct-horse',
      });

      await expect(execution).rejects.toMatchObject({
        code: IdentityExceptionCodeEnum.AUTH_USER_INACTIVE,
        message: 'User user-1 is disabled',
      });
      expect(credentials.verifyPassword).toHaveBeenCalled();
      expect(credentials.issueAccessToken).not.toHaveBeenCalled();
    });
  });
});
