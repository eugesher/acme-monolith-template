import { CredentialsSignAccessTokenCase } from '../credentials-sign-access-token.case';
import type { ICredentialsAccessTokenPort } from '../../../outbound';

describe('CredentialsSignAccessTokenCase', () => {
  let accessToken: jest.Mocked<ICredentialsAccessTokenPort>;
  let signAccessTokenCase: CredentialsSignAccessTokenCase;

  beforeEach(() => {
    accessToken = { sign: jest.fn(), verify: jest.fn() };
    accessToken.sign.mockResolvedValue('access-token');
    signAccessTokenCase = new CredentialsSignAccessTokenCase(accessToken);
  });

  it('signs an access token for the subject', async () => {
    const token = await signAccessTokenCase.execute({ sub: 'user-1' });

    expect(token).toBe('access-token');
    expect(accessToken.sign).toHaveBeenCalledWith({ sub: 'user-1' });
  });
});
