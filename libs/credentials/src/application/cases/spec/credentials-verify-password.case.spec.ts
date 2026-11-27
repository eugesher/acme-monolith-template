import { CredentialsVerifyPasswordCase } from '../credentials-verify-password.case';
import type { ICredentialsPasswordHasherPort } from '../../../outbound';

describe('CredentialsVerifyPasswordCase', () => {
  let passwordHasher: jest.Mocked<ICredentialsPasswordHasherPort>;
  let verifyPasswordCase: CredentialsVerifyPasswordCase;

  beforeEach(() => {
    passwordHasher = { hash: jest.fn(), verify: jest.fn() };
    passwordHasher.verify.mockResolvedValue(true);
    verifyPasswordCase = new CredentialsVerifyPasswordCase(passwordHasher);
  });

  it('checks the password against its hash', async () => {
    const valid = await verifyPasswordCase.execute({
      passwordHash: 'argon-hash',
      password: 'correct-horse',
    });

    expect(valid).toBe(true);
    expect(passwordHasher.verify).toHaveBeenCalledWith({
      passwordHash: 'argon-hash',
      password: 'correct-horse',
    });
  });
});
