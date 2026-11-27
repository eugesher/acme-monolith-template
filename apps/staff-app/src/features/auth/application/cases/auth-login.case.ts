import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { EmailValue } from '@acme-core/domain';

import { AuthInvalidCredentialsException, AuthStaffUserLoginModel } from '../../domain';
import {
  AUTH_CREDENTIALS_PORT,
  AUTH_LOGIN_REPOSITORY_PORT,
  type IAuthCredentialsPort,
  type IAuthLoginRepositoryPort,
} from '../../outbound';
import type { IAuthLoginCommand, IAuthLoginView } from '../types';

@Injectable()
export class AuthLoginCase {
  constructor(
    @Inject(AUTH_LOGIN_REPOSITORY_PORT)
    private readonly repository: IAuthLoginRepositoryPort,
    @Inject(AUTH_CREDENTIALS_PORT)
    private readonly credentials: IAuthCredentialsPort,
    @InjectPinoLogger(AuthLoginCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: IAuthLoginCommand): Promise<IAuthLoginView> {
    const { email, password } = command;
    const userEmail = EmailValue.create(email);

    const userRecord = await this.repository.findByEmail(userEmail.address);
    const user = userRecord ? AuthStaffUserLoginModel.reconstitute(userRecord) : null;

    const passwordHash = user?.passwordHash ?? null;
    const isPasswordValid = await this.credentials.verifyPassword({ passwordHash, password });

    if (!user) {
      this.logger.warn('Login failed: unknown email');

      throw new AuthInvalidCredentialsException();
    }

    if (!isPasswordValid) {
      this.logger.warn({ userId: user.id }, 'Login failed: wrong password');

      throw new AuthInvalidCredentialsException();
    }

    user.assertActive();

    const accessToken = await this.credentials.issueAccessToken(user.id);
    const userLoggerPayload = user.toLoggerPayload();

    this.logger.info(userLoggerPayload, 'User logged in');

    return { accessToken };
  }
}
