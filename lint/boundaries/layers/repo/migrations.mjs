export const repoMigrations = {
  category: 'repo:migrations',
  pattern: 'migrations/**',
  capture: [],
  allow: ['dotenv', 'fs', 'joi', 'path', 'typeorm', 'migrations/**'],
};
