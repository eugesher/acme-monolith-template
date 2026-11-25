import { DataSource, type SelectQueryBuilder } from 'typeorm';

import { Product } from '@acme-core/entities';

import { ProductStockPostSubtractPersistenceProductBuilder } from '../product-stock-post-subtract-persistence-product.builder';

describe('ProductStockPostSubtractPersistenceProductBuilder', () => {
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

  describe('forActive', () => {
    it('selects the ids of the active products among the given ones in id order', () => {
      const builder = new ProductStockPostSubtractPersistenceProductBuilder(baseBuilder).forActive([
        '100',
        '101',
      ]);

      expect(builder.getQueryAndParameters()).toEqual([
        'SELECT `Product`.`id` AS `Product_id` FROM `product` `Product` WHERE `Product`.`id` IN (?, ?) AND `Product`.`status` = ? ORDER BY `Product_id` ASC',
        ['100', '101', 'active'],
      ]);
    });
  });
});
