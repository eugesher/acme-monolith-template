export default {
  category: 'acme-app:processors:infrastructure:common-adapters',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/infrastructure/common-adapters/**',
  capture: ['app', 'module', 'single', 'area', 'submodule', 'file'],
  allow: [
    '@acme-<app>/processors/<module>/outbound/**',
    '@acme-<app>/contracts',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
