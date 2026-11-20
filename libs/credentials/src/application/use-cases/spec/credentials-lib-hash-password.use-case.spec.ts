import { CredentialsLibHashPasswordUseCase } from '../credentials-lib-hash-password.use-case';
import type { ICredentialsLibPasswordHasherPort } from '../../../outbound';

describe('CredentialsLibHashPasswordUseCase', () => {
  let passwordHasher: jest.Mocked<ICredentialsLibPasswordHasherPort>;
  let useCase: CredentialsLibHashPasswordUseCase;

  beforeEach(() => {
    passwordHasher = { hash: jest.fn(), verify: jest.fn() };
    passwordHasher.hash.mockResolvedValue('argon-hash');
    useCase = new CredentialsLibHashPasswordUseCase(passwordHasher);
  });

  it('hashes the password', async () => {
    const passwordHash = await useCase.execute('correct-horse-battery');

    expect(passwordHash).toBe('argon-hash');
    expect(passwordHasher.hash).toHaveBeenCalledWith('correct-horse-battery');
  });
});
