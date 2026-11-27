export const appsAppSetupEntities = {
  category: 'apps:app:setup:entities',
  pattern: 'apps/*/src/app/setup/entities/**',
  capture: ['app'],
  allow: ['@nestjs/typeorm', '@acme-core/entities', '@acme-<app>/common/entities'],
};
