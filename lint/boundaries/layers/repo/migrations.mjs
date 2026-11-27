export const repoMigrations = {
  category: 'repo:migrations',
  pattern: 'migrations/**',
  capture: [],
  allow: ['migrations/**', 'dotenv', 'fs', 'joi', 'path', 'typeorm'],
};
