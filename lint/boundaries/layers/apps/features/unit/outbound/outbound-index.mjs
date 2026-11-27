export const appsFeaturesUnitOutboundIndex = {
  category: 'apps:features:unit:outbound:index',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/index.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/features/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
