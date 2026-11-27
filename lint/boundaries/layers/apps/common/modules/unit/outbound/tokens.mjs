export const appsCommonModulesUnitOutboundTokens = {
  category: 'apps:common:modules:unit:outbound:tokens',
  pattern: 'apps/*/src/common/modules/*/outbound/tokens/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/common/modules/<unit>/outbound/**',
  ],
};
