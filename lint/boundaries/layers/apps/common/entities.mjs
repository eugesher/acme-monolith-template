export const appsCommonEntities = {
  category: 'apps:common:entities',
  pattern: 'apps/*/src/common/entities/**',
  capture: ['app'],
  allow: ['@acme-<app>/common/entities', '@acme-core/entities', '@acme-libs/kernel', 'typeorm'],
};
