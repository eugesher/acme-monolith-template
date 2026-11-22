import { CredentialsHashPasswordUseCase } from '../credentials-hash-password.use-case';
import type { ICredentialsPasswordHasherPort } from '../../../outbound';

describe('CredentialsHashPasswordUseCase', () => {
  let passwordHasher: jest.Mocked<ICredentialsPasswordHasherPort>;
  let useCase: CredentialsHashPasswordUseCase;

  beforeEach(() => {
    passwordHasher = { hash: jest.fn(), verify: jest.fn() };
    passwordHasher.hash.mockResolvedValue('argon-hash');
    useCase = new CredentialsHashPasswordUseCase(passwordHasher);
  });

  it('hashes the password', async () => {
    const passwordHash = await useCase.execute('correct-horse-battery');

    expect(passwordHash).toBe('argon-hash');
    expect(passwordHasher.hash).toHaveBeenCalledWith('correct-horse-battery');
  });
});
