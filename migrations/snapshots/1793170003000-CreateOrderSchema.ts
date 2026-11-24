import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderSchema1793170003000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`order\` (
        id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        customer_id BIGINT UNSIGNED NOT NULL,
        created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_order_customer (customer_id, id),
        CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES customer (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE order_product (
        id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        order_id   BIGINT UNSIGNED NOT NULL,
        product_id BIGINT UNSIGNED NOT NULL,
        INDEX idx_order_product_order (order_id),
        INDEX idx_order_product_product (product_id),
        CONSTRAINT fk_order_product_order FOREIGN KEY (order_id) REFERENCES \`order\` (id),
        CONSTRAINT fk_order_product_product FOREIGN KEY (product_id) REFERENCES product (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
      ALTER TABLE product_stock
        ADD COLUMN order_product_id BIGINT UNSIGNED NULL AFTER quantity,
        ADD UNIQUE KEY uq_product_stock_order_product (order_product_id),
        ADD CONSTRAINT fk_product_stock_order_product FOREIGN KEY (order_product_id)
          REFERENCES order_product (id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE product_stock
        DROP FOREIGN KEY fk_product_stock_order_product,
        DROP INDEX uq_product_stock_order_product,
        DROP COLUMN order_product_id;
    `);
    await queryRunner.query('DROP TABLE IF EXISTS order_product');
    await queryRunner.query('DROP TABLE IF EXISTS `order`');
  }
}
