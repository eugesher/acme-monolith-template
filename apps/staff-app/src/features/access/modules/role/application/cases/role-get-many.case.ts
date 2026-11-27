import { Inject, Injectable } from '@nestjs/common';

import { RoleGetManyModel } from '../../domain';
import { ROLE_LIST_REPOSITORY_PORT, type IRoleGetManyRepositoryPort } from '../../outbound';
import type { IRoleView } from '../types';

@Injectable()
export class RoleGetManyCase {
  constructor(
    @Inject(ROLE_LIST_REPOSITORY_PORT)
    private readonly repository: IRoleGetManyRepositoryPort,
  ) {}

  public async execute(): Promise<IRoleView[]> {
    const roleRecords = await this.repository.list();

    return RoleGetManyModel.toViewData(roleRecords);
  }
}
