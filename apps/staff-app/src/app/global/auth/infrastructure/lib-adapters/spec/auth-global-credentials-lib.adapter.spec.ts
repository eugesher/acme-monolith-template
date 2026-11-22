import type { ICredentialsLibPort } from '@acme-libs/contracts/credentials';

import { AuthGlobalCredentialsLibAdapter } from '../auth-global-credentials-lib.adapter';

describe('AuthGlobalCredentialsLibAdapter', () => {
  let credentials: jest.Mocked<ICredentialsLibPort>;
  let adapter: AuthGlobalCredentialsLibAdapter;

  beforeEach(() => {
    credentials = {
      handleSignAccessToken: jest.fn(),
      handleVerifyAccessToken: jest.fn(),
      handleHashPassword: jest.fn(),
      handleVerifyPassword: jest.fn(),
    };
    adapter = new AuthGlobalCredentialsLibAdapter(credentials);
  });

  describe('verifyAccessToken', () => {
    it('answers the user id the lib reads from a token that verifies', async () => {
      credentials.handleVerifyAccessToken.mockResolvedValue({ sub: 'user-1' });

      const userId = await adapter.verifyAccessToken('access-token');

      expect(userId).toBe('user-1');
      expect(credentials.handleVerifyAccessToken).toHaveBeenCalledWith('access-token');
    });

    it('answers no user id for a token the lib does not verify', async () => {
      credentials.handleVerifyAccessToken.mockResolvedValue(null);

      const userId = await adapter.verifyAccessToken('access-token');

      expect(userId).toBeNull();
    });
  });
});
