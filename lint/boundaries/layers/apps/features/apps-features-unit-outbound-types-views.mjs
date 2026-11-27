export default {
  category: 'apps:features:unit:outbound:types:views',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/types/views/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/features/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
