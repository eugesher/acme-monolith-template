export default {
  category: 'apps:features:unit:outbound',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/*.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/features/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
