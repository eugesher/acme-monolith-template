export const appsCommonModulesUnitInfrastructureIndex = {
  category: 'apps:common:modules:unit:infrastructure:index',
  pattern: 'apps/*/src/common/modules/*/infrastructure/index.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/common/modules/<unit>/infrastructure/persistence',
  ],
};
