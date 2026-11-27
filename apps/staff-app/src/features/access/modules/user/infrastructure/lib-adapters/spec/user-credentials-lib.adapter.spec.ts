import type { ICredentialsPort } from '@acme-libs/contracts/credentials';

import { UserCredentialsLibAdapter } from '../user-credentials-lib.adapter';

describe('UserCredentialsLibAdapter', () => {
  let credentials: jest.Mocked<ICredentialsPort>;
  let adapter: UserCredentialsLibAdapter;

  beforeEach(() => {
    credentials = {
      signAccessToken: jest.fn(),
      verifyAccessToken: jest.fn(),
      hashPassword: jest.fn(),
      verifyPassword: jest.fn(),
    };
    adapter = new UserCredentialsLibAdapter(credentials);
  });

  describe('hashPassword', () => {
    it('hashes the password with the credentials lib', async () => {
      credentials.hashPassword.mockResolvedValue('argon-hash');

      const passwordHash = await adapter.hashPassword('correct-horse-battery');

      expect(passwordHash).toBe('argon-hash');
      expect(credentials.hashPassword).toHaveBeenCalledWith('correct-horse-battery');
    });
  });
});
