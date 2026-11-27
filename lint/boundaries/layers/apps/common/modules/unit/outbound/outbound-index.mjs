export const appsCommonModulesUnitOutboundIndex = {
  category: 'apps:common:modules:unit:outbound:index',
  pattern: 'apps/*/src/common/modules/*/outbound/index.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/common/modules/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
