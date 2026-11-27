import { CredentialsVerifyAccessTokenCase } from '../credentials-verify-access-token.case';
import type { ICredentialsAccessTokenPort } from '../../../outbound';

describe('CredentialsVerifyAccessTokenCase', () => {
  let accessToken: jest.Mocked<ICredentialsAccessTokenPort>;
  let verifyAccessTokenCase: CredentialsVerifyAccessTokenCase;

  beforeEach(() => {
    accessToken = { sign: jest.fn(), verify: jest.fn() };
    verifyAccessTokenCase = new CredentialsVerifyAccessTokenCase(accessToken);
  });

  it('answers the subject of a token that verifies', async () => {
    accessToken.verify.mockResolvedValue({ sub: 'user-1' });

    const claims = await verifyAccessTokenCase.execute('access-token');

    expect(claims).toEqual({ sub: 'user-1' });
    expect(accessToken.verify).toHaveBeenCalledWith('access-token');
  });

  it('answers no subject for a token that does not verify', async () => {
    accessToken.verify.mockResolvedValue(null);

    const claims = await verifyAccessTokenCase.execute('access-token');

    expect(claims).toBeNull();
  });
});
