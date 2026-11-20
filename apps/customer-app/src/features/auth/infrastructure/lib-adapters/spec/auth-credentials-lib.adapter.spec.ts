import type { ICredentialsLibPort } from '@acme-libs/contracts/credentials';

import { AuthCredentialsLibAdapter } from '../auth-credentials-lib.adapter';

describe('AuthCredentialsLibAdapter', () => {
  let credentials: jest.Mocked<ICredentialsLibPort>;
  let adapter: AuthCredentialsLibAdapter;

  beforeEach(() => {
    credentials = {
      handleSignAccessToken: jest.fn(),
      handleHashPassword: jest.fn(),
      handleVerifyPassword: jest.fn(),
    };
    adapter = new AuthCredentialsLibAdapter(credentials);
  });

  describe('issueAccessToken', () => {
    it('signs a token whose subject is the customer', async () => {
      credentials.handleSignAccessToken.mockResolvedValue('access-token');

      const accessToken = await adapter.issueAccessToken('customer-1');

      expect(accessToken).toBe('access-token');
      expect(credentials.handleSignAccessToken).toHaveBeenCalledWith({ sub: 'customer-1' });
    });
  });

  describe('hashPassword', () => {
    it('hashes the password with the credentials lib', async () => {
      credentials.handleHashPassword.mockResolvedValue('argon-hash');

      const passwordHash = await adapter.hashPassword('correct-horse-battery');

      expect(passwordHash).toBe('argon-hash');
      expect(credentials.handleHashPassword).toHaveBeenCalledWith('correct-horse-battery');
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
