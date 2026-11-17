import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { AuthEmailTakenException, UserStaffUserCandidateModel } from '../../domain';
import {
  USER_CREDENTIALS_PORT,
  USER_REGISTER_REPOSITORY_PORT,
  USER_TRANSACTION_PORT,
  UserRegisterStaffUserInsertOutcomeEnum,
  type IUserCredentialsPort,
  type IUserRegisterRepositoryPort,
  type IUserTransactionPort,
} from '../../outbound';
import type { IUserRegisterCommand, IUserRegisterView } from '../interfaces';

@Injectable()
export class UserRegisterUseCase {
  constructor(
    @Inject(USER_REGISTER_REPOSITORY_PORT)
    private readonly repository: IUserRegisterRepositoryPort,
    @Inject(USER_TRANSACTION_PORT)
    private readonly transaction: IUserTransactionPort,
    @Inject(USER_CREDENTIALS_PORT)
    private readonly credentials: IUserCredentialsPort,
    @InjectPinoLogger(UserRegisterUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: IUserRegisterCommand): Promise<IUserRegisterView> {
    const { email, password, roleIds } = command;

    UserStaffUserCandidateModel.assertPasswordStrength(password);

    const passwordHash = await this.credentials.hashPassword(password);
    const userCandidate = UserStaffUserCandidateModel.create({ email, passwordHash, roleIds });
    const userId = await this.transaction.run(() => this.insert(userCandidate));
    const userLoggerPayload = userCandidate.toLoggerPayload(userId);

    this.logger.info(userLoggerPayload, 'User registered');

    return userCandidate.toSnapshot(userId);
  }

  private async insert(candidate: UserStaffUserCandidateModel): Promise<string> {
    const userInsertPayload = candidate.toInsertPayload();
    const insertResult = await this.repository.insertUser(userInsertPayload);

    if (insertResult.outcome === UserRegisterStaffUserInsertOutcomeEnum.DUPLICATE) {
      throw new AuthEmailTakenException();
    }

    const { id } = insertResult;
    const storedRoles = await this.repository.findRoles(candidate.distinctRoleIds);

    candidate.assertRoles(storedRoles);

    const userRoles = candidate.getUserRoles(id);

    await this.repository.insertUserRoles(userRoles);

    return id;
  }
}
