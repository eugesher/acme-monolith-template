export const appsProcessorsUnitOutboundTokens = {
  category: 'apps:processors:unit:outbound:tokens',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/tokens/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/processors/<unit>/outbound/**',
  ],
};
