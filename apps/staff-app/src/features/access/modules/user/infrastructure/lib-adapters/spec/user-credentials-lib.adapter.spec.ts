import type { ICredentialsLibPort } from '@acme-libs/contracts/credentials';

import { UserCredentialsLibAdapter } from '../user-credentials-lib.adapter';

describe('UserCredentialsLibAdapter', () => {
  let credentials: jest.Mocked<ICredentialsLibPort>;
  let adapter: UserCredentialsLibAdapter;

  beforeEach(() => {
    credentials = {
      handleSignAccessToken: jest.fn(),
      handleHashPassword: jest.fn(),
      handleVerifyPassword: jest.fn(),
    };
    adapter = new UserCredentialsLibAdapter(credentials);
  });

  describe('hashPassword', () => {
    it('hashes the password with the credentials lib', async () => {
      credentials.handleHashPassword.mockResolvedValue('argon-hash');

      const passwordHash = await adapter.hashPassword('correct-horse-battery');

      expect(passwordHash).toBe('argon-hash');
      expect(credentials.handleHashPassword).toHaveBeenCalledWith('correct-horse-battery');
    });
  });
});
