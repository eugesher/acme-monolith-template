import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductSchema1793170002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE product (
        id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        sku        VARCHAR(64)  NOT NULL,
        name       VARCHAR(255) NOT NULL,
        status     ENUM('draft','active','archived') NOT NULL DEFAULT 'draft',
        version    INT          NOT NULL DEFAULT 1,
        created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP    NULL,
        UNIQUE KEY uq_product_sku (sku)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE product_stock (
        id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        product_id BIGINT UNSIGNED NOT NULL,
        quantity   INT             NOT NULL,
        created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
        KEY idx_product_stock_product (product_id, quantity),
        CONSTRAINT fk_product_stock_product FOREIGN KEY (product_id) REFERENCES product (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS product_stock');
    await queryRunner.query('DROP TABLE IF EXISTS product');
  }
}
