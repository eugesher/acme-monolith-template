import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIdempotencySchema1793170004000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE idempotency_key (
        id                   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        scope                VARCHAR(64)  NOT NULL,
        idempotency_key      VARCHAR(128) NOT NULL,
        request_fingerprint  CHAR(64)     NOT NULL,
        status               VARCHAR(16)  NOT NULL DEFAULT 'in_flight',
        response_body        TEXT         NULL,
        created_at           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_idempotency_scope_key (scope, idempotency_key),
        INDEX idx_idempotency_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS idempotency_key');
  }
}
