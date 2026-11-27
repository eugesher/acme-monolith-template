export default {
  category: 'apps:features:unit:outbound:types:enums',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/types/enums/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/features/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
