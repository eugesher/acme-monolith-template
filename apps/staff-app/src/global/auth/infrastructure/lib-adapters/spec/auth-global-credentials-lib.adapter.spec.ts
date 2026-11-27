import type { ICredentialsPort } from '@acme-libs/contracts/credentials';

import { AuthGlobalCredentialsLibAdapter } from '../auth-global-credentials-lib.adapter';

describe('AuthGlobalCredentialsLibAdapter', () => {
  let credentials: jest.Mocked<ICredentialsPort>;
  let adapter: AuthGlobalCredentialsLibAdapter;

  beforeEach(() => {
    credentials = {
      signAccessToken: jest.fn(),
      verifyAccessToken: jest.fn(),
      hashPassword: jest.fn(),
      verifyPassword: jest.fn(),
    };
    adapter = new AuthGlobalCredentialsLibAdapter(credentials);
  });

  describe('verifyAccessToken', () => {
    it('answers the user id the lib reads from a token that verifies', async () => {
      credentials.verifyAccessToken.mockResolvedValue({ sub: 'user-1' });

      const userId = await adapter.verifyAccessToken('access-token');

      expect(userId).toBe('user-1');
      expect(credentials.verifyAccessToken).toHaveBeenCalledWith('access-token');
    });

    it('answers no user id for a token the lib does not verify', async () => {
      credentials.verifyAccessToken.mockResolvedValue(null);

      const userId = await adapter.verifyAccessToken('access-token');

      expect(userId).toBeNull();
    });
  });
});
