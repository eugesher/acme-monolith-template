export const appsProcessorsUnitOutboundTokens = {
  category: 'apps:processors:unit:outbound:tokens',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/tokens/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/processors/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
