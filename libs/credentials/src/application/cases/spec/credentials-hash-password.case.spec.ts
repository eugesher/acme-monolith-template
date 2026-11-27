import { CredentialsHashPasswordCase } from '../credentials-hash-password.case';
import type { ICredentialsPasswordHasherPort } from '../../../outbound';

describe('CredentialsHashPasswordCase', () => {
  let passwordHasher: jest.Mocked<ICredentialsPasswordHasherPort>;
  let hashPasswordCase: CredentialsHashPasswordCase;

  beforeEach(() => {
    passwordHasher = { hash: jest.fn(), verify: jest.fn() };
    passwordHasher.hash.mockResolvedValue('argon-hash');
    hashPasswordCase = new CredentialsHashPasswordCase(passwordHasher);
  });

  it('hashes the password', async () => {
    const passwordHash = await hashPasswordCase.execute('correct-horse-battery');

    expect(passwordHash).toBe('argon-hash');
    expect(passwordHasher.hash).toHaveBeenCalledWith('correct-horse-battery');
  });
});
