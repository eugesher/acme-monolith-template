import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { RoleNotFoundException, RoleReassignPermissionsModel } from '../../domain';
import {
  ROLE_REASSIGN_PERMISSIONS_REPOSITORY_PORT,
  ROLE_TRANSACTION_PORT,
  type IRoleReassignPermissionsRepositoryPort,
  type IRoleTransactionPort,
} from '../../outbound';
import type { IRoleReassignPermissionsCommand, IRoleView } from '../types';

@Injectable()
export class RoleReassignPermissionsUseCase {
  constructor(
    @Inject(ROLE_REASSIGN_PERMISSIONS_REPOSITORY_PORT)
    private readonly repository: IRoleReassignPermissionsRepositoryPort,
    @Inject(ROLE_TRANSACTION_PORT)
    private readonly transaction: IRoleTransactionPort,
    @InjectPinoLogger(RoleReassignPermissionsUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: IRoleReassignPermissionsCommand): Promise<IRoleView> {
    const role = await this.transaction.run(() => this.reassign(command));
    const roleLoggerPayload = role.toLoggerPayload();

    this.logger.info(roleLoggerPayload, 'Role permissions reassigned');

    return role.toSnapshot();
  }

  private async reassign(
    command: IRoleReassignPermissionsCommand,
  ): Promise<RoleReassignPermissionsModel> {
    const { roleId, permissionCodes } = command;
    const roleRecord = await this.repository.findRole(roleId);

    if (!roleRecord) {
      throw new RoleNotFoundException(roleId);
    }

    const role = RoleReassignPermissionsModel.reconstitute(roleRecord);

    role.reassignPermissions(permissionCodes);

    const rolePermissions = role.getRolePermissions();

    await this.repository.deleteRolePermissions(role.id);
    await this.repository.insertRolePermissions(rolePermissions);

    return role;
  }
}
