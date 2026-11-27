export default {
  category: 'acme-app:processors:infrastructure:core-adapters',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/infrastructure/core-adapters/**',
  capture: ['app', 'module', 'single', 'area', 'submodule', 'file'],
  allow: [
    '@acme-<app>/processors/<module>/outbound/**',
    '@acme-core/contracts',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
