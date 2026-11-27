export const appsCommonEntities = {
  category: 'apps:common:entities',
  pattern: 'apps/*/src/common/entities/**',
  capture: ['app'],
  allow: ['typeorm', '@acme-libs/kernel', '@acme-<app>/common/entities'],
};
