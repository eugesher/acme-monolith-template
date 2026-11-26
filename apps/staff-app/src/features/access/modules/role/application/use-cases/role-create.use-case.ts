import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { RoleCandidateModel, RoleCreateModel, RoleNameTakenException } from '../../domain';
import {
  ROLE_CREATE_REPOSITORY_PORT,
  ROLE_TRANSACTION_PORT,
  RoleCreateStaffRoleInsertOutcomeEnum,
  type IRoleCreateRepositoryPort,
  type IRoleTransactionPort,
} from '../../outbound';
import type { IRoleCreateCommand, IRoleView } from '../types';

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
    const role = await this.transaction.run(() => this.create(roleCandidate));
    const roleLoggerPayload = role.toLoggerPayload();

    this.logger.info(roleLoggerPayload, 'Role created');

    return role.toSnapshot();
  }

  private async create(candidate: RoleCandidateModel): Promise<RoleCreateModel> {
    const roleInsertPayload = candidate.toInsertPayload();
    const insertResult = await this.repository.insertRole(roleInsertPayload);

    if (insertResult.outcome === RoleCreateStaffRoleInsertOutcomeEnum.DUPLICATE) {
      throw new RoleNameTakenException(roleInsertPayload.name);
    }

    const roleId = insertResult.id;

    const rolePermissions = candidate.createRolePermissions(roleId);
    await this.repository.insertRolePermissions(rolePermissions);

    const createdRole = candidate.toCreated(roleId);

    return RoleCreateModel.reconstitute(createdRole);
  }
}
