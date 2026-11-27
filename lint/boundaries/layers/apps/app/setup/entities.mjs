export const appsAppSetupEntities = {
  category: 'apps:app:setup:entities',
  pattern: 'apps/*/src/app/setup/entities/**',
  capture: ['app'],
  allow: ['@acme-core/entities', '@acme-<app>/common/entities', '@nestjs/typeorm'],
};
