import { DataSource, type SelectQueryBuilder } from 'typeorm';

import { LedgerEntry } from '@acme-core/entities';

import { LedgerAppendPersistenceLedgerEntryBuilder } from '../ledger-append-persistence-ledger-entry.builder';

describe('LedgerAppendPersistenceLedgerEntryBuilder', () => {
  let dataSource: DataSource;
  let baseBuilder: SelectQueryBuilder<LedgerEntry>;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'mysql',
      database: 'acme',
      entities: [LedgerEntry],
    });
    jest.spyOn(dataSource.driver, 'connect').mockResolvedValue();
    jest.spyOn(dataSource.driver, 'afterConnect').mockResolvedValue();

    await dataSource.initialize();
  });

  beforeEach(() => {
    baseBuilder = dataSource.getRepository(LedgerEntry).createQueryBuilder(LedgerEntry.name);
  });

  describe('forOperationKey', () => {
    it('selects the id of the entry with the operation key', () => {
      const builder = new LedgerAppendPersistenceLedgerEntryBuilder(baseBuilder).forOperationKey(
        'op-1',
      );

      expect(builder.getQueryAndParameters()).toEqual([
        'SELECT `LedgerEntry`.`id` AS `LedgerEntry_id` FROM `ledger_entry` `LedgerEntry` WHERE `LedgerEntry`.`operationKey` = ?',
        ['op-1'],
      ]);
    });
  });
});
