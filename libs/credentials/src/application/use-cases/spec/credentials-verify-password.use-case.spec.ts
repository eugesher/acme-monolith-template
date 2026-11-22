import { CredentialsVerifyPasswordUseCase } from '../credentials-verify-password.use-case';
import type { ICredentialsPasswordHasherPort } from '../../../outbound';

describe('CredentialsVerifyPasswordUseCase', () => {
  let passwordHasher: jest.Mocked<ICredentialsPasswordHasherPort>;
  let useCase: CredentialsVerifyPasswordUseCase;

  beforeEach(() => {
    passwordHasher = { hash: jest.fn(), verify: jest.fn() };
    passwordHasher.verify.mockResolvedValue(true);
    useCase = new CredentialsVerifyPasswordUseCase(passwordHasher);
  });

  it('checks the password against its hash', async () => {
    const valid = await useCase.execute({ passwordHash: 'argon-hash', password: 'correct-horse' });

    expect(valid).toBe(true);
    expect(passwordHasher.verify).toHaveBeenCalledWith({
      passwordHash: 'argon-hash',
      password: 'correct-horse',
    });
  });
});
