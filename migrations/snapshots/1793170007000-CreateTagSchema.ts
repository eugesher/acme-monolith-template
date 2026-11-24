import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTagSchema1793170007000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE tag (
        id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(64) NOT NULL,
        created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_tag_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE tag_subject (
        tag_id       BIGINT UNSIGNED NOT NULL,
        subject_type VARCHAR(32)     NOT NULL,
        subject_id   BIGINT UNSIGNED NOT NULL,
        created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (tag_id, subject_type, subject_id),
        KEY idx_tag_subject_subject (subject_type, subject_id),
        CONSTRAINT fk_tag_subject_tag FOREIGN KEY (tag_id)
          REFERENCES tag (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS tag_subject');
    await queryRunner.query('DROP TABLE IF EXISTS tag');
  }
}
