import { CredentialsSignAccessTokenUseCase } from '../credentials-sign-access-token.use-case';
import type { ICredentialsAccessTokenPort } from '../../../outbound';

describe('CredentialsSignAccessTokenUseCase', () => {
  let accessToken: jest.Mocked<ICredentialsAccessTokenPort>;
  let useCase: CredentialsSignAccessTokenUseCase;

  beforeEach(() => {
    accessToken = { sign: jest.fn(), verify: jest.fn() };
    accessToken.sign.mockResolvedValue('access-token');
    useCase = new CredentialsSignAccessTokenUseCase(accessToken);
  });

  it('signs an access token for the subject', async () => {
    const token = await useCase.execute({ sub: 'user-1' });

    expect(token).toBe('access-token');
    expect(accessToken.sign).toHaveBeenCalledWith({ sub: 'user-1' });
  });
});
