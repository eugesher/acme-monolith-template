import { Injectable } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';
import type {
  IAuthCommonFindSubjectCommand,
  IAuthCommonPort,
  IAuthCommonSubjectView,
} from '@acme-staff/contracts/auth';

import { AuthCommonFindSubjectUseCase } from '../application';

@Injectable()
export class AuthCommonFacade implements IAuthCommonPort {
  constructor(private readonly findSubject: AuthCommonFindSubjectUseCase) {}

  public async handleFindSubject(
    command: IAuthCommonFindSubjectCommand,
  ): Promise<Nullable<IAuthCommonSubjectView>> {
    return await this.findSubject.execute(command);
  }
}
