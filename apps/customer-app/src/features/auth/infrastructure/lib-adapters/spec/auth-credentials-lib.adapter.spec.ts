import type { ICredentialsPort } from '@acme-libs/contracts/credentials';

import { AuthCredentialsLibAdapter } from '../auth-credentials-lib.adapter';

describe('AuthCredentialsLibAdapter', () => {
  let credentials: jest.Mocked<ICredentialsPort>;
  let adapter: AuthCredentialsLibAdapter;

  beforeEach(() => {
    credentials = {
      signAccessToken: jest.fn(),
      verifyAccessToken: jest.fn(),
      hashPassword: jest.fn(),
      verifyPassword: jest.fn(),
    };
    adapter = new AuthCredentialsLibAdapter(credentials);
  });

  describe('issueAccessToken', () => {
    it('signs a token whose subject is the customer', async () => {
      credentials.signAccessToken.mockResolvedValue('access-token');

      const accessToken = await adapter.issueAccessToken('customer-1');

      expect(accessToken).toBe('access-token');
      expect(credentials.signAccessToken).toHaveBeenCalledWith({ sub: 'customer-1' });
    });
  });

  describe('hashPassword', () => {
    it('hashes the password with the credentials lib', async () => {
      credentials.hashPassword.mockResolvedValue('argon-hash');

      const passwordHash = await adapter.hashPassword('correct-horse-battery');

      expect(passwordHash).toBe('argon-hash');
      expect(credentials.hashPassword).toHaveBeenCalledWith('correct-horse-battery');
    });
  });

  describe('verifyPassword', () => {
    it('checks the password against its hash with the credentials lib', async () => {
      credentials.verifyPassword.mockResolvedValue(true);

      const valid = await adapter.verifyPassword({
        passwordHash: 'argon-hash',
        password: 'correct-horse',
      });

      expect(valid).toBe(true);
      expect(credentials.verifyPassword).toHaveBeenCalledWith({
        passwordHash: 'argon-hash',
        password: 'correct-horse',
      });
    });
  });
});
