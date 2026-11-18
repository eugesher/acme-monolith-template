import { DataSource, type SelectQueryBuilder } from 'typeorm';

import { Product } from '@acme-core/entities';

import { ProductCorePersistenceBuilder } from '../product-core-persistence.builder';

describe('ProductCorePersistenceBuilder', () => {
  let dataSource: DataSource;
  let baseBuilder: SelectQueryBuilder<Product>;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'mysql',
      database: 'acme',
      entities: [Product],
    });
    jest.spyOn(dataSource.driver, 'connect').mockResolvedValue();
    jest.spyOn(dataSource.driver, 'afterConnect').mockResolvedValue();

    await dataSource.initialize();
  });

  beforeEach(() => {
    baseBuilder = dataSource.getRepository(Product).createQueryBuilder(Product.name);
  });

  describe('forId', () => {
    it('selects the product with the time of its last update', () => {
      const builder = new ProductCorePersistenceBuilder(baseBuilder);

      builder.forId('100');

      expect(builder.getQueryAndParameters()).toEqual([
        'SELECT `Product`.`id` AS `Product_id`, `Product`.`sku` AS `Product_sku`, `Product`.`status` AS `Product_status`, `Product`.`version` AS `Product_version`, `Product`.`updatedAt` AS `Product_updatedAt` FROM `product` `Product` WHERE ( `Product`.`id` = ? ) AND ( `Product`.`deletedAt` IS NULL )',
        ['100'],
      ]);
    });
  });

  describe('forLockById', () => {
    it('selects the product under an exclusive lock', () => {
      const builder = new ProductCorePersistenceBuilder(baseBuilder);

      builder.forLockById('100');

      expect(builder.getQueryAndParameters()).toEqual([
        'SELECT `Product`.`id` AS `Product_id`, `Product`.`sku` AS `Product_sku`, `Product`.`status` AS `Product_status`, `Product`.`version` AS `Product_version`, `Product`.`updatedAt` AS `Product_updatedAt` FROM `product` `Product` WHERE ( `Product`.`id` = ? ) AND ( `Product`.`deletedAt` IS NULL ) FOR UPDATE',
        ['100'],
      ]);
    });

    it('returns the same builder for chaining', () => {
      const builder = new ProductCorePersistenceBuilder(baseBuilder);
      const chained = builder.forLockById('100');

      expect(chained).toBe(builder);
    });
  });
});
