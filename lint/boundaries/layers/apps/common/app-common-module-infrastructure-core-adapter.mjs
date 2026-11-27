export default {
  category: 'acme-app:common:modules:infrastructure:core-adapters',
  pattern: 'apps/*/src/common/modules/*/infrastructure/core-adapters/**',
  capture: ['app', 'module', 'file'],
  allow: [
    '@acme-<app>/common/modules/<module>/outbound/**',
    '@acme-core/contracts',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
