export default {
  category: 'apps:features:unit:outbound:tokens',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/tokens/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/features/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
