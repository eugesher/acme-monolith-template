export const appsFeaturesUnitOutboundIndex = {
  category: 'apps:features:unit:outbound:index',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/index.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/features/<unit>/outbound/**',
  ],
};
