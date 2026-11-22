import { CredentialsVerifyAccessTokenUseCase } from '../credentials-verify-access-token.use-case';
import type { ICredentialsAccessTokenPort } from '../../../outbound';

describe('CredentialsVerifyAccessTokenUseCase', () => {
  let accessToken: jest.Mocked<ICredentialsAccessTokenPort>;
  let useCase: CredentialsVerifyAccessTokenUseCase;

  beforeEach(() => {
    accessToken = { sign: jest.fn(), verify: jest.fn() };
    useCase = new CredentialsVerifyAccessTokenUseCase(accessToken);
  });

  it('answers the subject of a token that verifies', async () => {
    accessToken.verify.mockResolvedValue({ sub: 'user-1' });

    const claims = await useCase.execute('access-token');

    expect(claims).toEqual({ sub: 'user-1' });
    expect(accessToken.verify).toHaveBeenCalledWith('access-token');
  });

  it('answers no subject for a token that does not verify', async () => {
    accessToken.verify.mockResolvedValue(null);

    const claims = await useCase.execute('access-token');

    expect(claims).toBeNull();
  });
});
