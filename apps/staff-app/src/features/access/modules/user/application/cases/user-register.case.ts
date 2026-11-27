import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import {
  UserEmailTakenException,
  UserStaffUserCandidateModel,
  UserStaffUserRegisterModel,
} from '../../domain';
import {
  USER_CREDENTIALS_PORT,
  USER_REGISTER_REPOSITORY_PORT,
  USER_TRANSACTION_PORT,
  UserRegisterStaffUserInsertOutcomeEnum,
  type IUserCredentialsPort,
  type IUserRegisterRepositoryPort,
  type IUserTransactionPort,
} from '../../outbound';
import type { IUserRegisterCommand, IUserRegisterView } from '../types';

@Injectable()
export class UserRegisterCase {
  constructor(
    @Inject(USER_REGISTER_REPOSITORY_PORT)
    private readonly repository: IUserRegisterRepositoryPort,
    @Inject(USER_TRANSACTION_PORT)
    private readonly transaction: IUserTransactionPort,
    @Inject(USER_CREDENTIALS_PORT)
    private readonly credentials: IUserCredentialsPort,
    @InjectPinoLogger(UserRegisterCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: IUserRegisterCommand): Promise<IUserRegisterView> {
    const { email, password, roleIds } = command;

    UserStaffUserCandidateModel.assertPasswordStrength(password);

    const passwordHash = await this.credentials.hashPassword(password);
    const userCandidate = UserStaffUserCandidateModel.create({ email, passwordHash, roleIds });

    userCandidate.assertEmail();

    const user = await this.transaction.run(() => this.register(userCandidate));
    const userLoggerPayload = user.toLoggerPayload();

    this.logger.info(userLoggerPayload, 'User registered');

    return user.toSnapshot();
  }

  private async register(
    candidate: UserStaffUserCandidateModel,
  ): Promise<UserStaffUserRegisterModel> {
    const userInsertPayload = candidate.toInsertPayload();
    const insertResult = await this.repository.insertUser(userInsertPayload);

    if (insertResult.outcome === UserRegisterStaffUserInsertOutcomeEnum.DUPLICATE) {
      throw new UserEmailTakenException();
    }

    const { id } = insertResult;
    const storedRoles = await this.repository.findMany(candidate.distinctRoleIds);

    candidate.assertRoles(storedRoles);

    const userRoles = candidate.createUserRoles(id);

    await this.repository.insertUserRoles(userRoles);

    const registeredUser = candidate.toRegistered(id);

    return UserStaffUserRegisterModel.reconstitute(registeredUser);
  }
}
