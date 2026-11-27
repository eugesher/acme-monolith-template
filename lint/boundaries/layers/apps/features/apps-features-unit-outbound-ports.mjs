export default {
  category: 'apps:features:unit:outbound:ports',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/ports/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/features/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
