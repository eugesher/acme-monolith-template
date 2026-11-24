import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLedgerSchema1793170005000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE ledger_entry (
        id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        operation_key  VARCHAR(128) NOT NULL,
        subject_type   VARCHAR(64)  NOT NULL,
        subject_id     VARCHAR(64)  NOT NULL,
        action         VARCHAR(64)  NOT NULL,
        payload        JSON         NOT NULL,
        correlation_id VARCHAR(64)  NOT NULL DEFAULT '',
        occurred_at    TIMESTAMP(3) NOT NULL,
        recorded_at    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        UNIQUE KEY uq_ledger_operation_key (operation_key),
        KEY idx_ledger_subject (subject_type, subject_id),
        KEY idx_ledger_correlation (correlation_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS ledger_entry');
  }
}
