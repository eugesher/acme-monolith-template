import { Injectable, type ClassProvider } from '@nestjs/common';

import { MysqlErrorHelper } from '@acme-libs/toolkit';

import {
  AUTH_REGISTER_REPOSITORY_PORT,
  AuthRegisterCustomerInsertOutcomeEnum,
  type IAuthRegisterCustomerInsertQuery,
  type IAuthRegisterCustomerInsertRecord,
  type IAuthRegisterRepositoryPort,
} from '../../../outbound';
import { AuthPersistenceHost } from '../host/auth-persistence.host';

@Injectable()
export class AuthRegisterRepository
  extends AuthPersistenceHost
  implements IAuthRegisterRepositoryPort
{
  public static readonly provider: ClassProvider<IAuthRegisterRepositoryPort> = {
    provide: AUTH_REGISTER_REPOSITORY_PORT,
    useClass: AuthRegisterRepository,
  };

  public async insert(
    query: IAuthRegisterCustomerInsertQuery,
  ): Promise<IAuthRegisterCustomerInsertRecord> {
    const insertedRows = await MysqlErrorHelper.catchDuplicateKey(() =>
      this.customerRepository.insertReturning([query]),
    );

    if (insertedRows === null) {
      return { outcome: AuthRegisterCustomerInsertOutcomeEnum.DUPLICATE };
    }

    const [customerRow] = insertedRows;
    const { id, createdAt } = customerRow;

    return { outcome: AuthRegisterCustomerInsertOutcomeEnum.INSERTED, id, createdAt };
  }
}
