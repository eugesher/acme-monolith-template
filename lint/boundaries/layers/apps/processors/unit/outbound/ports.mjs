export const appsProcessorsUnitOutboundPorts = {
  category: 'apps:processors:unit:outbound:ports',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/ports/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/processors/<unit>/outbound/**',
  ],
};
