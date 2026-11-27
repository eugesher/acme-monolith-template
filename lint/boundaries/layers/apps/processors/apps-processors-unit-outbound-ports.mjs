export default {
  category: 'apps:processors:unit:outbound:ports',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/ports/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/processors/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
