import { Inject, Injectable } from '@nestjs/common';

import { RoleListModel } from '../../domain';
import { ROLE_LIST_REPOSITORY_PORT, type IRoleListRepositoryPort } from '../../outbound';
import type { IRoleView } from '../types';

@Injectable()
export class RoleListUseCase {
  constructor(
    @Inject(ROLE_LIST_REPOSITORY_PORT)
    private readonly repository: IRoleListRepositoryPort,
  ) {}

  public async execute(): Promise<IRoleView[]> {
    const roleRecords = await this.repository.list();

    return RoleListModel.toViewData(roleRecords);
  }
}
