import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { AuthRoleNameTakenException, RoleCandidateModel } from '../../domain';
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
    const roleCandidate = RoleCandidateModel.create({ name, permissionCodes });
    const roleId = await this.transaction.run(() => this.insert(roleCandidate));
    const roleLoggerPayload = roleCandidate.toLoggerPayload(roleId);

    this.logger.info(roleLoggerPayload, 'Role created');

    return roleCandidate.toSnapshot(roleId);
  }

  private async insert(candidate: RoleCandidateModel): Promise<string> {
    const roleInsertPayload = candidate.toInsertPayload();
    const insertResult = await this.repository.insertRole(roleInsertPayload);

    if (insertResult.outcome === RoleCreateStaffRoleInsertOutcomeEnum.DUPLICATE) {
      throw new AuthRoleNameTakenException(roleInsertPayload.name);
    }

    const { id } = insertResult;
    const rolePermissions = candidate.createRolePermissions(id);

    await this.repository.insertRolePermissions(rolePermissions);

    return id;
  }
}
