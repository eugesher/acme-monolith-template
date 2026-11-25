import { DataSource, type SelectQueryBuilder } from 'typeorm';

import { Product } from '@acme-core/entities';

import { ProductPersistenceBuilder } from '../product-persistence.builder';

describe('ProductPersistenceBuilder', () => {
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

  describe('forOne', () => {
    it('selects the product by id', () => {
      const builder = new ProductPersistenceBuilder(baseBuilder).forOne('100');

      expect(builder.getQueryAndParameters()).toEqual([
        'SELECT `Product`.`id` AS `Product_id`, `Product`.`sku` AS `Product_sku`, `Product`.`name` AS `Product_name`, `Product`.`status` AS `Product_status`, `Product`.`version` AS `Product_version`, `Product`.`createdAt` AS `Product_createdAt`, `Product`.`updatedAt` AS `Product_updatedAt` FROM `product` `Product` WHERE `Product`.`id` = ?',
        ['100'],
      ]);
    });
  });

  describe('forList', () => {
    it('selects every product newest first inside the page window', () => {
      const builder = new ProductPersistenceBuilder(baseBuilder).forList({
        limit: 20,
        offset: 40,
        productIds: undefined,
      });

      expect(builder.getQueryAndParameters()).toEqual([
        'SELECT `Product`.`id` AS `Product_id`, `Product`.`sku` AS `Product_sku`, `Product`.`name` AS `Product_name`, `Product`.`status` AS `Product_status`, `Product`.`version` AS `Product_version`, `Product`.`createdAt` AS `Product_createdAt`, `Product`.`updatedAt` AS `Product_updatedAt` FROM `product` `Product` ORDER BY `Product_id` DESC LIMIT 20 OFFSET 40',
        [],
      ]);
    });

    it('keeps only the given products', () => {
      const builder = new ProductPersistenceBuilder(baseBuilder).forList({
        limit: 20,
        offset: 0,
        productIds: ['100', '101'],
      });

      expect(builder.getQueryAndParameters()).toEqual([
        'SELECT `Product`.`id` AS `Product_id`, `Product`.`sku` AS `Product_sku`, `Product`.`name` AS `Product_name`, `Product`.`status` AS `Product_status`, `Product`.`version` AS `Product_version`, `Product`.`createdAt` AS `Product_createdAt`, `Product`.`updatedAt` AS `Product_updatedAt` FROM `product` `Product` WHERE `Product`.`id` IN (?, ?) ORDER BY `Product_id` DESC LIMIT 20 OFFSET 0',
        ['100', '101'],
      ]);
    });
  });

  describe('forLockOne', () => {
    it('selects the id of the product under an exclusive lock', () => {
      const builder = new ProductPersistenceBuilder(baseBuilder).forLockOne('100');

      expect(builder.getQueryAndParameters()).toEqual([
        'SELECT `Product`.`id` AS `Product_id` FROM `product` `Product` WHERE `Product`.`id` = ? FOR UPDATE',
        ['100'],
      ]);
    });
  });
});
