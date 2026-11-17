import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import {
  AuthCustomerCandidateModel,
  AuthCustomerRegisterModel,
  AuthEmailTakenException,
} from '../../domain';
import {
  AUTH_CREDENTIALS_PORT,
  AUTH_LEDGER_PORT,
  AUTH_REGISTER_REPOSITORY_PORT,
  AuthRegisterCustomerInsertOutcomeEnum,
  type IAuthCredentialsPort,
  type IAuthLedgerPort,
  type IAuthRegisterRepositoryPort,
} from '../../outbound';
import type { IAuthRegisterCommand, IAuthRegisterView } from '../interfaces';

@Injectable()
export class AuthRegisterUseCase {
  constructor(
    @Inject(AUTH_REGISTER_REPOSITORY_PORT)
    private readonly repository: IAuthRegisterRepositoryPort,
    @Inject(AUTH_CREDENTIALS_PORT)
    private readonly credentials: IAuthCredentialsPort,
    @Inject(AUTH_LEDGER_PORT)
    private readonly ledger: IAuthLedgerPort,
    @InjectPinoLogger(AuthRegisterUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: IAuthRegisterCommand): Promise<IAuthRegisterView> {
    const { email, password } = command;

    AuthCustomerCandidateModel.assertPasswordStrength(password);

    const passwordHash = await this.credentials.hashPassword(password);
    const customerCandidate = AuthCustomerCandidateModel.create({ email, passwordHash });
    const customerId = await this.insert(customerCandidate);
    const registeredCustomer = customerCandidate.toRegistered(customerId);
    const customer = AuthCustomerRegisterModel.reconstitute(registeredCustomer);
    const customerLoggerPayload = customer.toLoggerPayload();
    const customerLedgerPayload = customer.toLedgerPayload();

    this.logger.info(customerLoggerPayload, 'Customer registered');

    await this.ledger.recordRegistered(customerLedgerPayload);

    return customer.toSnapshot();
  }

  private async insert(candidate: AuthCustomerCandidateModel): Promise<string> {
    const customerInsertPayload = candidate.toInsertPayload();
    const insertResult = await this.repository.insert(customerInsertPayload);

    if (insertResult.outcome === AuthRegisterCustomerInsertOutcomeEnum.DUPLICATE) {
      throw new AuthEmailTakenException();
    }

    return insertResult.id;
  }
}
