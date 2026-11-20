import { CredentialsLibVerifyPasswordUseCase } from '../credentials-lib-verify-password.use-case';
import type { ICredentialsLibPasswordHasherPort } from '../../../outbound';

describe('CredentialsLibVerifyPasswordUseCase', () => {
  let passwordHasher: jest.Mocked<ICredentialsLibPasswordHasherPort>;
  let useCase: CredentialsLibVerifyPasswordUseCase;

  beforeEach(() => {
    passwordHasher = { hash: jest.fn(), verify: jest.fn() };
    passwordHasher.verify.mockResolvedValue(true);
    useCase = new CredentialsLibVerifyPasswordUseCase(passwordHasher);
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
