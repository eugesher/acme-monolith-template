export default {
  category: 'apps:features:unit:infrastructure:core-adapters',
  pattern: 'apps/*/src/features/{*,*/modules/*}/infrastructure/core-adapters/**',
  capture: ['app', 'unit', '', '', '', 'file'],
  allow: [
    '@acme-<app>/features/<unit>/outbound/**',
    '@acme-core/contracts',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
