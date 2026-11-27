import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNoteSchema1793170006000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE note (
        id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        subject_type VARCHAR(64)  NOT NULL,
        subject_id   VARCHAR(64)  NOT NULL,
        title        VARCHAR(100) NOT NULL,
        body         TEXT         NOT NULL,
        author_id    BIGINT UNSIGNED NOT NULL,
        resolved     TINYINT(1)   NOT NULL DEFAULT 0,
        version      INT          NOT NULL DEFAULT 1,
        created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at   TIMESTAMP    NULL,
        INDEX idx_note_subject (subject_type, subject_id),
        INDEX idx_note_author (author_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE note_revision (
        id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        note_id        BIGINT UNSIGNED NOT NULL,
        note_version   INT          NOT NULL,
        title_before   VARCHAR(100) NOT NULL,
        title_after    VARCHAR(100) NOT NULL,
        body_before    TEXT         NOT NULL,
        body_after     TEXT         NOT NULL,
        editor_id      BIGINT UNSIGNED NOT NULL,
        correlation_id VARCHAR(64)  NOT NULL DEFAULT '',
        recorded_at    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        UNIQUE KEY uq_note_revision_version (note_id, note_version),
        INDEX idx_note_revision_correlation (correlation_id),
        CONSTRAINT fk_note_revision_note FOREIGN KEY (note_id)
          REFERENCES note (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS note_revision');
    await queryRunner.query('DROP TABLE IF EXISTS note');
  }
}
