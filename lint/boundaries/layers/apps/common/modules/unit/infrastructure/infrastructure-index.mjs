export const appsCommonModulesUnitInfrastructureIndex = {
  category: 'apps:common:modules:unit:infrastructure:index',
  pattern: 'apps/*/src/common/modules/*/infrastructure/index.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/common/modules/<unit>/infrastructure/index',
    '@acme-<app>/common/modules/<unit>/infrastructure/persistence',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
