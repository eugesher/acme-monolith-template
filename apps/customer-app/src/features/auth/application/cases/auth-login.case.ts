import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { EmailValue } from '@acme-core/domain';

import { AuthCustomerLoginModel, AuthInvalidCredentialsException } from '../../domain';
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
    const customerEmail = EmailValue.create(email);

    const customerRecord = await this.repository.findByEmail(customerEmail.address);
    const customer = customerRecord ? AuthCustomerLoginModel.reconstitute(customerRecord) : null;

    const passwordHash = customer?.passwordHash ?? null;
    const isPasswordValid = await this.credentials.verifyPassword({ passwordHash, password });

    if (!customer) {
      this.logger.warn('Login failed: unknown email');

      throw new AuthInvalidCredentialsException();
    }

    if (!isPasswordValid) {
      this.logger.warn({ customerId: customer.id }, 'Login failed: wrong password');

      throw new AuthInvalidCredentialsException();
    }

    customer.assertActive();

    const accessToken = await this.credentials.issueAccessToken(customer.id);
    const customerLoggerPayload = customer.toLoggerPayload();

    this.logger.info(customerLoggerPayload, 'Customer logged in');

    return { accessToken };
  }
}
