import { Injectable, ServiceUnavailableException, type ClassProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, verify } from 'argon2';

import { Semaphore } from '@acme-libs/toolkit';
import type { ICredentialsVerifyPasswordCommand } from '@acme-libs/contracts/credentials';

import {
  CREDENTIALS_PASSWORD_HASHER_PORT,
  type ICredentialsPasswordHasherPort,
} from '../../outbound';
import { CredentialsPasswordHasherOptions } from './credentials-password-hasher.options';

@Injectable()
export class CredentialsPasswordHasherAdapter implements ICredentialsPasswordHasherPort {
  public static readonly PROVIDER: ClassProvider<ICredentialsPasswordHasherPort> = {
    provide: CREDENTIALS_PASSWORD_HASHER_PORT,
    useClass: CredentialsPasswordHasherAdapter,
  };

  private static readonly DUMMY_PASSWORD = 'dummy-password-of-an-unknown-user';

  private readonly options: CredentialsPasswordHasherOptions;
  private readonly semaphore: Semaphore;
  private readonly dummyHash: Promise<string>;

  constructor(config: ConfigService) {
    this.options = new CredentialsPasswordHasherOptions(config);
    this.semaphore = new Semaphore({
      maxConcurrency: config.getOrThrow<number>('AUTH_ARGON2_MAX_CONCURRENCY'),
      queueTimeoutMs: config.getOrThrow<number>('AUTH_ARGON2_QUEUE_TIMEOUT_MS'),
      onQueueTimeout: () =>
        new ServiceUnavailableException('Too many password checks at once, retry later'),
    });
    this.dummyHash = hash(CredentialsPasswordHasherAdapter.DUMMY_PASSWORD, this.options);
  }

  public async hash(password: string): Promise<string> {
    return await this.semaphore.run(() => hash(password, this.options));
  }

  public async verify(command: ICredentialsVerifyPasswordCommand): Promise<boolean> {
    return await this.semaphore.run(() => this.verifyHash(command));
  }

  private async verifyHash(command: ICredentialsVerifyPasswordCommand): Promise<boolean> {
    const { passwordHash, password } = command;
    const checkedHash = passwordHash ?? (await this.dummyHash);

    try {
      const isPasswordValid = await verify(checkedHash, password);

      return isPasswordValid && passwordHash !== null;
    } catch {
      return false;
    }
  }
}
