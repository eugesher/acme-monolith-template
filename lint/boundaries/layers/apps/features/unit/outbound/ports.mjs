export const appsFeaturesUnitOutboundPorts = {
  category: 'apps:features:unit:outbound:ports',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/ports/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/features/<unit>/outbound/**',
  ],
};
