import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStaffSchema1793170001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE staff_user (
        id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        email         VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        status        VARCHAR(16)  NOT NULL DEFAULT 'active',
        created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_staff_user_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE staff_role (
        id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name        VARCHAR(64) NOT NULL,
        description VARCHAR(255) NULL,
        UNIQUE KEY uq_staff_role_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE staff_user_roles (
        user_id BIGINT UNSIGNED NOT NULL,
        role_id BIGINT UNSIGNED NOT NULL,
        PRIMARY KEY (user_id, role_id),
        CONSTRAINT fk_staff_user_roles_user FOREIGN KEY (user_id) REFERENCES staff_user(id) ON DELETE CASCADE,
        CONSTRAINT fk_staff_user_roles_role FOREIGN KEY (role_id) REFERENCES staff_role(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE staff_role_permissions (
        role_id BIGINT UNSIGNED NOT NULL,
        code    VARCHAR(64) NOT NULL,
        PRIMARY KEY (role_id, code),
        CONSTRAINT fk_staff_role_permissions_role FOREIGN KEY (role_id) REFERENCES staff_role(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS staff_role_permissions');
    await queryRunner.query('DROP TABLE IF EXISTS staff_user_roles');
    await queryRunner.query('DROP TABLE IF EXISTS staff_role');
    await queryRunner.query('DROP TABLE IF EXISTS staff_user');
  }
}
