export const appsCommonModulesUnitOutbound = {
  category: 'apps:common:modules:unit:outbound',
  pattern: 'apps/*/src/common/modules/*/outbound/*.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/common/modules/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
