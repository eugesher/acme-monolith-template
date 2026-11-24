import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomerSchema1793170000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE customer (
        id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        email         VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        status        VARCHAR(16)  NOT NULL DEFAULT 'active',
        created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_customer_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS customer');
  }
}
