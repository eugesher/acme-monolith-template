import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { UserNotFoundException, UserStaffUserRolesModel } from '../../domain';
import {
  USER_REASSIGN_ROLES_REPOSITORY_PORT,
  USER_TRANSACTION_PORT,
  type IUserReassignRolesRepositoryPort,
  type IUserTransactionPort,
} from '../../outbound';
import type { IUserReassignRolesCommand, IUserReassignRolesView } from '../interfaces';

@Injectable()
export class UserReassignRolesUseCase {
  constructor(
    @Inject(USER_REASSIGN_ROLES_REPOSITORY_PORT)
    private readonly repository: IUserReassignRolesRepositoryPort,
    @Inject(USER_TRANSACTION_PORT)
    private readonly transaction: IUserTransactionPort,
    @InjectPinoLogger(UserReassignRolesUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: IUserReassignRolesCommand): Promise<IUserReassignRolesView> {
    const { userId, roleIds } = command;
    const userExists = await this.repository.existsUser(userId);

    if (!userExists) {
      throw new UserNotFoundException(userId);
    }

    const userRoles = UserStaffUserRolesModel.create({ userId, roleIds });
    const storedRoles = await this.repository.findRoles(roleIds);

    userRoles.assertRoles(storedRoles);

    await this.transaction.run(() => this.reassign(userRoles, command));

    const userRolesLoggerPayload = userRoles.toLoggerPayload();

    this.logger.info(userRolesLoggerPayload, 'Roles reassigned');

    return userRoles.toSnapshot();
  }

  private async reassign(
    userRoles: UserStaffUserRolesModel,
    command: IUserReassignRolesCommand,
  ): Promise<void> {
    const { userId, roleIds } = command;
    const userRoleInsertQueries = userRoles.getUserRoles();

    await this.repository.deleteUserRolesExcept(userId, roleIds);
    await this.repository.insertUserRolesIgnore(userRoleInsertQueries);
  }
}
