export default {
  category: 'acme-app:features:infrastructure:common-adapters',
  pattern: 'apps/*/src/features/{*,*/modules/*}/infrastructure/common-adapters/**',
  capture: ['app', 'module', 'single', 'area', 'submodule', 'file'],
  allow: [
    '@acme-<app>/features/<module>/outbound/**',
    '@acme-<app>/contracts',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
