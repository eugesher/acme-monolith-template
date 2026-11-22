import type { ICredentialsPort } from '@acme-libs/contracts/credentials';

import { AuthCredentialsLibAdapter } from '../auth-credentials-lib.adapter';

describe('AuthCredentialsLibAdapter', () => {
  let credentials: jest.Mocked<ICredentialsPort>;
  let adapter: AuthCredentialsLibAdapter;

  beforeEach(() => {
    credentials = {
      handleSignAccessToken: jest.fn(),
      handleVerifyAccessToken: jest.fn(),
      handleHashPassword: jest.fn(),
      handleVerifyPassword: jest.fn(),
    };
    adapter = new AuthCredentialsLibAdapter(credentials);
  });

  describe('issueAccessToken', () => {
    it('signs a token whose subject is the user', async () => {
      credentials.handleSignAccessToken.mockResolvedValue('access-token');

      const accessToken = await adapter.issueAccessToken('user-1');

      expect(accessToken).toBe('access-token');
      expect(credentials.handleSignAccessToken).toHaveBeenCalledWith({ sub: 'user-1' });
    });
  });

  describe('verifyPassword', () => {
    it('checks the password against its hash with the credentials lib', async () => {
      credentials.handleVerifyPassword.mockResolvedValue(true);

      const valid = await adapter.verifyPassword({
        passwordHash: 'argon-hash',
        password: 'correct-horse',
      });

      expect(valid).toBe(true);
      expect(credentials.handleVerifyPassword).toHaveBeenCalledWith({
        passwordHash: 'argon-hash',
        password: 'correct-horse',
      });
    });
  });
});
