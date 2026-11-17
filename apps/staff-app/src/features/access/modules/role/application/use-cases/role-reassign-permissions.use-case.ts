import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { AuthRoleNotFoundException, RoleModel } from '../../domain';
import {
  ROLE_REASSIGN_PERMISSIONS_REPOSITORY_PORT,
  ROLE_TRANSACTION_PORT,
  type IRoleReassignPermissionsRepositoryPort,
  type IRoleTransactionPort,
} from '../../outbound';
import type { IRoleReassignPermissionsCommand, IRoleView } from '../interfaces';

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
    const roleLoggerPayload = role.toReassignPermissionsLoggerPayload();

    this.logger.info(roleLoggerPayload, 'Role permissions reassigned');

    return role.toSnapshot();
  }

  private async reassign(command: IRoleReassignPermissionsCommand): Promise<RoleModel> {
    const { roleId, permissionCodes } = command;
    const roleRecord = await this.repository.findRole(roleId);

    if (!roleRecord) {
      throw new AuthRoleNotFoundException(roleId);
    }

    const role = RoleModel.reconstitute(roleRecord);

    role.reassignPermissions(permissionCodes);

    const rolePermissions = role.getRolePermissions();

    await this.repository.deleteRolePermissions(role.id);
    await this.repository.insertRolePermissions(rolePermissions);

    return role;
  }
}
