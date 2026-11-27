export default {
  category: 'acme-app:processors:infrastructure:lib-adapters',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/infrastructure/lib-adapters/**',
  capture: ['app', 'module', 'single', 'area', 'submodule', 'file'],
  allow: [
    '@acme-<app>/processors/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
