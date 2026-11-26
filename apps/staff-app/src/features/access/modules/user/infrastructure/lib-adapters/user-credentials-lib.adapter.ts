import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import { CREDENTIALS_PORT, type ICredentialsPort } from '@acme-libs/contracts/credentials';

import { USER_CREDENTIALS_PORT, type IUserCredentialsPort } from '../../outbound';

@Injectable()
export class UserCredentialsLibAdapter implements IUserCredentialsPort {
  public static readonly PROVIDER: ClassProvider<IUserCredentialsPort> = {
    provide: USER_CREDENTIALS_PORT,
    useClass: UserCredentialsLibAdapter,
  };

  constructor(
    @Inject(CREDENTIALS_PORT)
    private readonly credentials: ICredentialsPort,
  ) {}

  public async hashPassword(password: string): Promise<string> {
    return await this.credentials.handleHashPassword(password);
  }
}
