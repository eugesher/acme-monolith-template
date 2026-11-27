export const appsCommonModulesUnitOutboundTokens = {
  category: 'apps:common:modules:unit:outbound:tokens',
  pattern: 'apps/*/src/common/modules/*/outbound/tokens/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/common/modules/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
