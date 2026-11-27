export default {
  category: 'acme-app:features:infrastructure:core-adapters',
  pattern: 'apps/*/src/features/{*,*/modules/*}/infrastructure/core-adapters/**',
  capture: ['app', 'module', 'single', 'area', 'submodule', 'file'],
  allow: [
    '@acme-<app>/features/<module>/outbound/**',
    '@acme-core/contracts',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
