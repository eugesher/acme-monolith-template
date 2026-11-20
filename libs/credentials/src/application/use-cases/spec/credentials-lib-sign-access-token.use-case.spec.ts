import { CredentialsLibSignAccessTokenUseCase } from '../credentials-lib-sign-access-token.use-case';
import type { ICredentialsLibAccessTokenPort } from '../../../outbound';

describe('CredentialsLibSignAccessTokenUseCase', () => {
  let accessToken: jest.Mocked<ICredentialsLibAccessTokenPort>;
  let useCase: CredentialsLibSignAccessTokenUseCase;

  beforeEach(() => {
    accessToken = { sign: jest.fn() };
    accessToken.sign.mockResolvedValue('access-token');
    useCase = new CredentialsLibSignAccessTokenUseCase(accessToken);
  });

  it('signs an access token for the subject', async () => {
    const token = await useCase.execute({ sub: 'user-1' });

    expect(token).toBe('access-token');
    expect(accessToken.sign).toHaveBeenCalledWith({ sub: 'user-1' });
  });
});
