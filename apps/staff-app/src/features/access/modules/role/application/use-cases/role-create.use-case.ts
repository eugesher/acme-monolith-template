import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { AuthRoleNameTakenException, RoleModel, type IRoleCandidate } from '../../domain';
import {
  ROLE_CREATE_REPOSITORY_PORT,
  ROLE_TRANSACTION_PORT,
  RoleCreateStaffRoleInsertOutcomeEnum,
  type IRoleCreateRepositoryPort,
  type IRoleTransactionPort,
} from '../../outbound';
import type { IRoleCreateCommand, IRoleView } from '../interfaces';

@Injectable()
export class RoleCreateUseCase {
  constructor(
    @Inject(ROLE_CREATE_REPOSITORY_PORT)
    private readonly repository: IRoleCreateRepositoryPort,
    @Inject(ROLE_TRANSACTION_PORT)
    private readonly transaction: IRoleTransactionPort,
    @InjectPinoLogger(RoleCreateUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: IRoleCreateCommand): Promise<IRoleView> {
    const { name, permissionCodes } = command;
    const roleCandidate = RoleModel.initCandidate({ name, permissionCodes });
    const roleId = await this.transaction.run(() => this.insert(roleCandidate));

    this.logger.info({ roleId }, 'Role created');

    return { id: roleId, name: roleCandidate.name, permissionCodes: roleCandidate.permissionCodes };
  }

  private async insert(candidate: IRoleCandidate): Promise<string> {
    const { name, permissionCodes } = candidate;

    const insertResult = await this.repository.insertRole({ name });

    if (insertResult.outcome === RoleCreateStaffRoleInsertOutcomeEnum.DUPLICATE) {
      throw new AuthRoleNameTakenException(name);
    }

    const { id } = insertResult;
    const rolePermissions = permissionCodes.map((code) => ({ roleId: id, code }));

    await this.repository.insertRolePermissions(rolePermissions);

    return id;
  }
}
