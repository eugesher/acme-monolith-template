export default {
  category: 'acme-app:features:infrastructure:lib-adapters',
  pattern: 'apps/*/src/features/{*,*/modules/*}/infrastructure/lib-adapters/**',
  capture: ['app', 'module', 'single', 'area', 'submodule', 'file'],
  allow: [
    '@acme-<app>/features/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/contracts/credentials',
    '@acme-libs/contracts/health',
    '@nestjs/common',
  ],
};
