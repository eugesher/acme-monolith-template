export default {
  category: 'apps:features:unit:domain',
  pattern: 'apps/*/src/features/{*,*/modules/*}/domain/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/features/<unit>/domain',
    '@acme-core/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
