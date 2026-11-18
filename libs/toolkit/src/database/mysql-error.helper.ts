import { QueryFailedError } from 'typeorm';

import type { Nullable } from '../types/utility.type';

interface IMysqlDriverError {
  errno?: number;
  code?: string;
}

export class MysqlErrorHelper {
  private static readonly DUPLICATE_ENTRY_ERRNO = 1062;

  public static isDuplicateKey(error: unknown): boolean {
    if (!(error instanceof QueryFailedError)) {
      return false;
    }

    const driverError = error.driverError as Error & IMysqlDriverError;

    return (
      driverError.errno === MysqlErrorHelper.DUPLICATE_ENTRY_ERRNO ||
      driverError.code === 'ER_DUP_ENTRY'
    );
  }

  public static async catchDuplicateKey<T>(statement: () => Promise<T>): Promise<Nullable<T>> {
    try {
      return await statement();
    } catch (error) {
      if (MysqlErrorHelper.isDuplicateKey(error)) {
        return null;
      }

      throw error;
    }
  }
}
