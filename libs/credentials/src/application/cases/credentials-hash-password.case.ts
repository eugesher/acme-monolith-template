import { Inject, Injectable } from '@nestjs/common';

import {
  CREDENTIALS_PASSWORD_HASHER_PORT,
  type ICredentialsPasswordHasherPort,
} from '../../outbound';

@Injectable()
export class CredentialsHashPasswordCase {
  constructor(
    @Inject(CREDENTIALS_PASSWORD_HASHER_PORT)
    private readonly passwordHasher: ICredentialsPasswordHasherPort,
  ) {}

  public async execute(password: string): Promise<string> {
    return await this.passwordHasher.hash(password);
  }
}
