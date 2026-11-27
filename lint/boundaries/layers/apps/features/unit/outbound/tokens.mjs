export const appsFeaturesUnitOutboundTokens = {
  category: 'apps:features:unit:outbound:tokens',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/tokens/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/features/<unit>/outbound/**',
  ],
};
