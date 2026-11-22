import type { ICredentialsPort } from '@acme-libs/contracts/credentials';

import { AuthGlobalCredentialsLibAdapter } from '../auth-global-credentials-lib.adapter';

describe('AuthGlobalCredentialsLibAdapter', () => {
  let credentials: jest.Mocked<ICredentialsPort>;
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
    it('answers the customer id the lib reads from a token that verifies', async () => {
      credentials.handleVerifyAccessToken.mockResolvedValue({ sub: 'customer-1' });

      const customerId = await adapter.verifyAccessToken('access-token');

      expect(customerId).toBe('customer-1');
      expect(credentials.handleVerifyAccessToken).toHaveBeenCalledWith('access-token');
    });

    it('answers no customer id for a token the lib does not verify', async () => {
      credentials.handleVerifyAccessToken.mockResolvedValue(null);

      const customerId = await adapter.verifyAccessToken('access-token');

      expect(customerId).toBeNull();
    });
  });
});
